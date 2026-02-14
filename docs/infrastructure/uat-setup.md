---
sidebar_position: 3
title: "UAT Setup"
description: "Guidelines for setting up a User Acceptance Testing environment"
---
# UAT Setup Guide

This guide outlines the process for deploying and configuring a UAT environment for FitNexa.

## 🌐 Infrastructure
- **Vercel**: Hosts the 4 web frontends.
- **Heroku / DigitalOcean**: Typically used for backend microservices.
- **Supabase / RDS**: Managed PostgreSQL databases.

## 🔧 Environment Mapping
UAT uses specific domain prefixes:
- `uat.docs.fitnexa.com`
- `uat.admin.fitnexa.com`

## 🚀 Deployment
Use the `git push origin uat` workflow to trigger automatic builds to the UAT environment.

---
Related: [Single Domain Vercel](single-domain-vercel.md) · [Environment Variables](../dev-workflows/environment-setup.md)
