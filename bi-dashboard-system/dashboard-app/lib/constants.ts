// dashboard-app/lib/constants.ts

export const APP_NAME = 'BI Dashboard System';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Business Intelligence Dashboard with comprehensive analytics';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const ETL_API_URL = process.env.NEXT_PUBLIC_ETL_API_URL || 'http://localhost:8000/api/v1';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// File Upload
export const MAX_FILE_SIZE = 52428800; // 50MB in bytes
export const ALLOWED_FILE_TYPES = ['xlsx', 'xls', 'csv'];
export const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATE_TIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Chart Colors
export const CHART_COLORS = {
  primary: '#22c55e',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

export const CHART_COLOR_PALETTE = [
  '#22c55e', // primary-600
  '#16a34a', // primary-700
  '#15803d', // primary-800
  '#166534', // primary-900
  '#14532d', // primary-950
  '#dcfce7', // primary-100
  '#bbf7d0', // primary-200
  '#86efac', // primary-300
];

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  USER: 'user',
} as const;

// User Status
export const USER_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

// Upload Status
export const UPLOAD_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REVERTED: 'reverted',
} as const;

// Dashboard Visualization Types
export const VISUALIZATION_TYPES = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'scatter', label: 'Scatter Plot' },
  { value: 'table', label: 'Data Table' },
  { value: 'heatmap', label: 'Heatmap' },
  { value: 'box', label: 'Box Plot' },
  { value: 'histogram', label: 'Histogram' },
] as const;

// Data Types
export const DATA_TYPES = [
  { value: 'string', label: 'Text (String)' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'datetime', label: 'Date & Time' },
  { value: 'boolean', label: 'Boolean (Yes/No)' },
  { value: 'text', label: 'Long Text' },
] as const;

// Relationship Types
export const RELATIONSHIP_TYPES = [
  { value: 'one_to_one', label: 'One to One' },
  { value: 'one_to_many', label: 'One to Many' },
  { value: 'many_to_many', label: 'Many to Many' },
] as const;

// Organization Unit Types
export const ORG_UNIT_TYPES = [
  { value: 'company', label: 'Company' },
  { value: 'division', label: 'Division' },
  { value: 'department', label: 'Department' },
  { value: 'team', label: 'Team' },
] as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'bi-dashboard-theme',
  SIDEBAR_COLLAPSED: 'bi-dashboard-sidebar-collapsed',
  RECENT_SEARCHES: 'bi-dashboard-recent-searches',
  USER_PREFERENCES: 'bi-dashboard-user-preferences',
} as const;

// Session Storage Keys
export const SESSION_KEYS = {
  REDIRECT_URL: 'bi-dashboard-redirect-url',
  UPLOAD_PROGRESS: 'bi-dashboard-upload-progress',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  FILE_SIZE: 'File size exceeds the maximum allowed size.',
  FILE_TYPE: 'File type is not supported.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully.',
  CREATED: 'Created successfully.',
  UPDATED: 'Updated successfully.',
  DELETED: 'Deleted successfully.',
  UPLOADED: 'File uploaded successfully.',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ANALYTICS: '/dashboard/analytics',
  DATA_MODELS: '/dashboard/data-models',
  UPLOADS: '/dashboard/uploads',
  USERS: '/dashboard/users',
  ROLES: '/dashboard/roles',
  ORGANIZATION: '/dashboard/organization',
  REPORTS: '/dashboard/reports',
  SETTINGS: '/dashboard/settings',
  PROFILE: '/dashboard/profile',
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const;

// Time intervals (in milliseconds)
export const TIME_INTERVALS = {
  SECOND: 1000,
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000,
  WEEK: 604800000,
} as const;

// Default Settings
export const DEFAULT_SETTINGS = {
  LANGUAGE: 'en',
  TIMEZONE: 'Africa/Maseru',
  DATE_FORMAT: 'MM/DD/YYYY',
  CURRENCY: 'LSL',
  ITEMS_PER_PAGE: 10,
  AUTO_REFRESH: false,
  REFRESH_INTERVAL: 300000, // 5 minutes
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_DARK_MODE: false,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_WEBSOCKETS: false,
  ENABLE_ANALYTICS: true,
  ENABLE_EXPORT: true,
} as const;