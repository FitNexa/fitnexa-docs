import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'overview/system-overview',
        'overview/architecture-review',
        'overview/quick-start',
      ],
    },
    {
      type: 'category',
      label: 'Backend Services',
      items: [
        'backend/architecture',
        'backend/services-catalog',
        'backend/error-handling',
        'backend/testing',
        {
          type: 'category',
          label: 'Service Guides',
          items: [
            'backend/services/gateway',
            'backend/services/identity-service',
            'backend/services/gym-service',
            'backend/services/content-service',
            'backend/services/nutrition-service',
            'backend/services/squad-service',
            'backend/services/messaging-service',
            'backend/services/logging-service',
            'backend/services/wizard-service',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Frontend Apps',
      items: [
        'frontend/overview',
        'frontend/api-client',
        'frontend/i18n',
        'frontend/testing',
        {
          type: 'category',
          label: 'App Guides',
          items: [
            'frontend/apps/landing',
            'frontend/apps/gym-admin',
            'frontend/apps/super-admin',
            'frontend/apps/onboarding',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Mobile App',
      items: [
        'mobile/mechanics',
        'mobile/error-handling',
        'mobile/i18n',
        'mobile/branding',
      ],
    },
    {
      type: 'category',
      label: '@fitnexa/shared',
      items: [
        'shared/overview',
      ],
    },
    {
      type: 'category',
      label: 'Infrastructure',
      items: [
        'infrastructure/logging-observability',
        'infrastructure/single-domain-vercel',
        'infrastructure/uat-setup',
      ],
    },
    {
      type: 'category',
      label: 'Developer Guide',
      items: [
        'dev-workflows/contributing',
        'dev-workflows/monorepo-scripts',
        'dev-workflows/environment-setup',
      ],
    },
    {
      type: 'category',
      label: 'AI Governance',
      items: [
        'ai-governance/guidelines',
        'ai-governance/decision-log',
      ],
    },
    {
      type: 'category',
      label: 'Production Readiness',
      items: [
        'production-readiness/overview',
        'production-readiness/security',
        'production-readiness/stability',
        'production-readiness/observability-quality',
        'production-readiness/roadmap',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/third-party-integration',
      ],
    },
  ],
};

export default sidebars;
