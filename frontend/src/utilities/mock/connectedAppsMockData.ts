export type AppStatus = 'connected' | 'degraded' | 'disconnected' | 'syncing';
export type AppCategory = 'Operations' | 'Finance' | 'Documents' | 'Workforce' | 'External Apps';

export interface ConnectedApp {
  id: string;
  label: string;
  icon: string;
  category: AppCategory;
  status: AppStatus;
  unreadCount?: number;
  pendingCount?: number;
  url?: string;
}

export const connectedApps: ConnectedApp[] = [
  // Operations
  {
    id: 'linear',
    label: 'Linear',
    icon: '🔷',
    category: 'Operations',
    status: 'connected',
    pendingCount: 4,
    url: 'https://linear.app',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: '📅',
    category: 'Operations',
    status: 'connected',
    pendingCount: 2,
    url: 'https://calendar.google.com',
  },
  {
    id: 'slack',
    label: 'Slack',
    icon: '💬',
    category: 'Operations',
    status: 'connected',
    unreadCount: 7,
    url: 'https://slack.com',
  },

  // Finance
  {
    id: 'quickbooks',
    label: 'QuickBooks',
    icon: '💹',
    category: 'Finance',
    status: 'connected',
    pendingCount: 3,
    url: 'https://quickbooks.intuit.com',
  },
  {
    id: 'mercury',
    label: 'Mercury',
    icon: '🏦',
    category: 'Finance',
    status: 'syncing',
    url: 'https://mercury.com',
  },

  // Documents
  {
    id: 'drive',
    label: 'Drive',
    icon: '🗄️',
    category: 'Documents',
    status: 'connected',
    url: 'https://drive.google.com',
  },
  {
    id: 'sheets',
    label: 'Sheets',
    icon: '📊',
    category: 'Documents',
    status: 'connected',
    url: 'https://sheets.google.com',
  },
  {
    id: 'docs',
    label: 'Docs',
    icon: '📝',
    category: 'Documents',
    status: 'connected',
    pendingCount: 1,
    url: 'https://docs.google.com',
  },
  {
    id: 'pdf-signer',
    label: 'PDF Signer',
    icon: '🖊️',
    category: 'Documents',
    status: 'connected',
    pendingCount: 2,
  },

  // Workforce
  {
    id: 'employee-tracking',
    label: 'Employee Tracking',
    icon: '👷',
    category: 'Workforce',
    status: 'connected',
    pendingCount: 1,
  },
  {
    id: 'email',
    label: 'Email',
    icon: '📧',
    category: 'Workforce',
    status: 'connected',
    unreadCount: 12,
    url: 'https://mail.google.com',
  },

  // External Apps
  {
    id: 'salesforce',
    label: 'Salesforce',
    icon: '☁️',
    category: 'External Apps',
    status: 'degraded',
    url: 'https://salesforce.com',
  },
  {
    id: 'freecad',
    label: 'FreeCAD',
    icon: '📐',
    category: 'External Apps',
    status: 'disconnected',
  },
];

export const APP_CATEGORIES: AppCategory[] = [
  'Operations',
  'Finance',
  'Documents',
  'Workforce',
  'External Apps',
];
