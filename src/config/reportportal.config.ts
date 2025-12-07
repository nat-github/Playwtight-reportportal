import { Environment } from './environment';

export const ReportPortalConfig = {
  enabled: Environment.REPORTPORTAL_ENABLED,
  token: Environment.REPORTPORTAL_TOKEN,
  endpoint: Environment.REPORTPORTAL_ENDPOINT,
  project: Environment.REPORTPORTAL_PROJECT,
  launch: Environment.REPORTPORTAL_LAUNCH,
 
  // ReportPortal client configuration
  clientConfig: {
    debug: false,
    attributes: [
      { key: 'framework', value: 'Playwright' },
      { key: 'language', value: 'TypeScript' },
      { key: 'project', value: 'UI_Bank_Demo' },
    ],
    description: 'Automated tests for UI Bank and JSONPlaceholder APIs',
  },
 
  // Launch attributes
  launchAttributes: [
    { value: 'web' },
    { value: 'api' },
    { value: 'regression' },
  ],
};