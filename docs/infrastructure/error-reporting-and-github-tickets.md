---
sidebar_position: 5
title: "Error Reporting and GitHub Tickets"
description: "Error-to-GitHub-ticket flow, configuration, and Copilot assignment"
---
# Error Reporting and GitHub Ticket System

This document describes the error-to-GitHub-ticket flow: when a backend error occurs, it is stored in the error table, then a processor creates a GitHub issue with detailed information.

## Flow Overview

1. **Error occurs** in a backend service (e.g. identity-service, gym-service).
2. **Error handler** (in `@fitnexa/shared`) catches the error, logs it, and optionally reports it to the logging service via `POST {LOGGING_URL}/errors`.
3. **Logging service** receives the error, stores it in MongoDB `error_reports` collection with a unique error code (e.g. `ERR-X7K2M9P4`), and returns the code.
4. **Background processor** runs asynchronously: finds pending errors, creates GitHub issues via Octokit, adds detailed comments (stack trace, metadata), and updates the error record with the issue URL.

## Configuration

### Backend services (reporting errors)

Set `LOGGING_URL` so the error handler can report errors:

```bash
LOGGING_URL=http://logging-service:3009
```

Example for identity-service in docker-compose:

```yaml
identity-service:
  environment:
    - LOGGING_URL=http://logging-service:3009
```

The service must call `attachErrorHandler` with options:

```ts
attachErrorHandler(app, logger, {
  reportUrl: process.env.LOGGING_URL,
  serviceName: 'identity-service',
});
```

### Logging service (GitHub ticket creation)

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Yes (for tickets) | GitHub PAT with `repo` scope |
| `GITHUB_ERROR_REPO_OWNER` | No | Default: `FitNexa` |
| `GITHUB_ERROR_REPO_NAME` | No | Default: `FitNexa` (main backend repo) |
| `GITHUB_ERROR_LABELS` | No | Comma-separated labels, e.g. `bug,auto-reported` |
| `OPENAI_API_KEY` | No | If set, an AI analysis comment is added to each new ticket (likely cause + suggestions) |
| `AI_ANALYSIS_ENABLED` | No | Set to `false` or `0` to disable AI analysis even when `OPENAI_API_KEY` is set |
| `AI_ANALYSIS_MODEL` | No | OpenAI model (default: `gpt-4o-mini`), e.g. `gpt-4o` for stronger analysis |
| `GITHUB_COPILOT_ASSIGN_ISSUES` | No | Set to `true` to assign each new issue to **GitHub Copilot** (coding agent). Copilot will analyze the issue and open a **pull request** with a proposed fix (not just a comment). Requires Copilot to be enabled for the repo. |
| `GITHUB_COPILOT_BASE_BRANCH` | No | Base branch for Copilot's PR (default: `main`) |
| `GITHUB_COPILOT_CUSTOM_INSTRUCTIONS` | No | Optional instructions for Copilot (e.g. "Focus on the stack trace and suggest a minimal fix.") |
| `GITHUB_COPILOT_MODEL` | No | Optional model hint for Copilot (Pro/Pro+ only) |

If `GITHUB_TOKEN` is not set, errors are still saved but no GitHub tickets are created.

**AI analysis vs GitHub Copilot**

- **OpenAI** (`OPENAI_API_KEY`): The logging service calls OpenAI and posts a **comment** with "🤖 AI Analysis" (likely cause + suggestions). No code changes.
- **GitHub Copilot** (`GITHUB_COPILOT_ASSIGN_ISSUES=true`): The new issue is **assigned to Copilot**. Copilot analyzes it and opens a **pull request** with a proposed fix. There is no GitHub API for "Copilot writes only a comment"; the coding agent is designed to create PRs.

**Quick start: use Copilot for every error ticket**

1. In the logging-service directory, copy `.env.example` to `.env` and set `GITHUB_TOKEN` (PAT with `repo`; user token for Copilot), `GITHUB_ERROR_REPO_OWNER` / `GITHUB_ERROR_REPO_NAME`, and `GITHUB_COPILOT_ASSIGN_ISSUES=true`.
2. Ensure [GitHub Copilot coding agent](https://docs.github.com/en/copilot/using-github-copilot/coding-agent/using-copilot-to-work-on-an-issue) is enabled for that repo and your account/org.
3. When a backend error is reported, the service creates the issue, adds the detailed comment (stack + request/response), then assigns the issue to `copilot-swe-agent[bot]`. Copilot will open a PR with a proposed fix.

## API

### POST /logging/errors

Reports an error for storage and optional GitHub ticket creation.

**Request body:**

```json
{
  "code": "INTERNAL_ERROR",
  "message": "Database connection failed",
  "stack": "Error: ...\n  at ...",
  "correlationId": "abc-123",
  "path": "/auth/login",
  "method": "POST",
  "service": "identity-service",
  "statusCode": 500,
  "details": {}
}
```

- `message` (required): Error message
- All other fields are optional

**Response (201):**

```json
{
  "errorCode": "ERR-X7K2M9P4",
  "status": "saved"
}
```

## Error table (MongoDB)

Collection: `error_reports`

| Field | Type | Description |
|-------|------|-------------|
| errorCode | string | Unique code (e.g. ERR-X7K2M9P4) |
| message | string | Error message |
| stack | string | Stack trace |
| correlationId | string | Request correlation ID |
| path | string | Request path |
| method | string | HTTP method |
| service | string | Originating service |
| statusCode | number | HTTP status |
| details | object | Additional payload |
| request | object | Request snapshot (for debugging) |
| response | object | Response snapshot (for debugging) |
| status | string | `pending` \| `ticketed` \| `failed` |
| githubIssueUrl | string | URL of created GitHub issue |
| githubIssueNumber | number | GitHub issue number |
| createdAt | Date | |
| updatedAt | Date | |

## GitHub ticket format

- **Issue title:** `[ERR-XXXXX] First 80 chars of message...`
- **Issue body:** Error code, message, service, path, method, status, correlation ID
- **First comment:** Full stack trace, request/response and JSON details
- **Second comment (optional):** **🤖 AI Analysis** – If `OPENAI_API_KEY` is set, the logging service calls OpenAI to analyze the error and posts a comment with likely cause and suggested fixes.
- **GitHub Copilot (optional):** If `GITHUB_COPILOT_ASSIGN_ISSUES=true`, the issue is assigned to the Copilot coding agent. Copilot will analyze the issue (using the body and first comment) and open a **pull request** with a proposed fix. This uses GitHub's official "assign issue to Copilot" API (public preview).

---
Related: [Logging Service](../backend/services/logging-service.md) · [Third-Party Services and Keys](third-party-services-and-keys.md)
