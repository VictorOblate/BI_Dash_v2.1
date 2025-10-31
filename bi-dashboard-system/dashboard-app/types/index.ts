// dashboard-app/types/index.ts

// Re-export all types from api.ts
export * from './api';

// Additional component prop types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
}

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  adminOnly?: boolean;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: any;
  defaultValue?: any;
}

export interface FormValues {
  [key: string]: any;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Chart types
export interface PlotlyData {
  x?: any[];
  y?: any[];
  type?: string;
  mode?: string;
  name?: string;
  marker?: any;
  line?: any;
  [key: string]: any;
}

export interface PlotlyLayout {
  title?: string;
  xaxis?: any;
  yaxis?: any;
  showlegend?: boolean;
  legend?: any;
  margin?: any;
  [key: string]: any;
}

// Dashboard builder types
export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  config: any;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  columns: number;
  rowHeight: number;
}

// File upload types
export interface UploadProgress {
  uploadId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

// Settings types
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    weeklyReport: boolean;
    dataUploads: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  privacy: {
    profileVisibility: 'everyone' | 'team' | 'admin';
    activityStatus: boolean;
    analytics: boolean;
  };
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
}

// Search and filter types
export interface SearchParams {
  query: string;
  filters: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ID = string | number;

// State management types
export interface AppState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

export interface Action<T = any> {
  type: string;
  payload?: T;
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  fonts: {
    body: string;
    heading: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Export utility type helpers
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];