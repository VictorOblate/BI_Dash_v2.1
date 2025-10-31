// dashboard-app/types/api.ts

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User related types
export interface User {
  id: number;
  email: string;
  fullName: string;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  roles?: UserRole[];
  organizationalUnits?: UserOrganizationalUnit[];
}

export interface UserRole {
  id: number;
  roleId: number;
  userId: number;
  assignedAt: string;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: RolePermission[];
}

export interface Permission {
  id: number;
  resource: string;
  action: string;
  description: string | null;
  createdAt: string;
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  createdAt: string;
  permission: Permission;
}

// Organization types
export interface OrganizationalUnit {
  id: number;
  name: string;
  type: 'company' | 'division' | 'department' | 'team';
  parentId: number | null;
  path: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  parent?: OrganizationalUnit;
  children?: OrganizationalUnit[];
  users?: UserOrganizationalUnit[];
}

export interface UserOrganizationalUnit {
  id: number;
  userId: number;
  orgUnitId: number;
  assignedAt: string;
  user?: User;
  organizationalUnit?: OrganizationalUnit;
}

// Dashboard types
export interface Dashboard {
  id: number;
  name: string;
  description: string | null;
  layout: any;
  isActive: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  creator?: User;
  tabs?: DashboardTab[];
  permissions?: DashboardPermission[];
}

export interface DashboardTab {
  id: number;
  dashboardId: number;
  name: string;
  order: number;
  config: any;
  createdAt: string;
  updatedAt: string;
  visualizations?: Visualization[];
}

export interface Visualization {
  id: number;
  tabId: number;
  type: string;
  title: string | null;
  config: any;
  query: string | null;
  order: number;
  refreshRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardPermission {
  id: number;
  dashboardId: number;
  roleId: number;
  permissionsJson: {
    view: boolean;
    edit: boolean;
    export: boolean;
  };
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

// Data Model types
export interface DataModel {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  schemaJson: FieldDefinition[];
  version: number;
  isActive: number;
  tableName: string | null;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
  sourceRelationships?: DataRelationship[];
  targetRelationships?: DataRelationship[];
}

export interface FieldDefinition {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'text';
  displayName?: string;
  required: boolean;
  unique: boolean;
  default?: any;
  constraints?: Record<string, any>;
}

export interface DataRelationship {
  id: number;
  name: string;
  sourceModelId: number;
  targetModelId: number;
  type: 'one_to_one' | 'one_to_many' | 'many_to_many';
  config: {
    sourceField: string;
    targetField: string;
  };
  isActive: number;
  createdAt: string;
  updatedAt: string;
  sourceModel?: DataModel;
  targetModel?: DataModel;
}

// Upload types
export interface UploadHistory {
  id: number;
  userId: number;
  modelId: number | null;
  fileName: string;
  filePath: string | null;
  fileSize: bigint | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'reverted';
  recordsCount: number | null;
  recordsSuccess: number | null;
  recordsFailed: number | null;
  errorLog: string | null;
  metadata: string | null;
  transactionId: string | null;
  createdAt: string;
  completedAt: string | null;
  user?: User;
  dataModel?: DataModel;
}

// Audit types
export interface AuditLog {
  id: number;
  userId: number | null;
  action: string;
  resource: string;
  resourceId: number | null;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  status: 'success' | 'failed';
  createdAt: string;
  user?: User;
}

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  status?: 'pending' | 'active' | 'inactive' | 'suspended';
  password?: string;
}

export interface CreateDataModelRequest {
  name: string;
  displayName: string;
  description?: string;
  schemaJson: FieldDefinition[];
}

export interface UpdateDataModelRequest {
  displayName?: string;
  description?: string;
  schemaJson?: FieldDefinition[];
  isActive?: boolean;
}

export interface CreateDashboardRequest {
  name: string;
  description?: string;
  layout?: any;
}

export interface UpdateDashboardRequest {
  name?: string;
  description?: string;
  layout?: any;
  isActive?: boolean;
}

export interface CreateVisualizationRequest {
  type: string;
  title?: string;
  config: any;
  query?: string;
  order?: number;
  refreshRate?: number;
}

export interface UploadFileRequest {
  modelId: number;
  file: File;
  columnMapping?: Record<string, string>;
}

// Filter and Sort types
export interface FilterParams {
  search?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Statistics types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  totalDataModels: number;
  totalUploads: number;
  totalDashboards: number;
}

export interface UploadStats {
  total: number;
  completed: number;
  failed: number;
  processing: number;
  totalRecords: number;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// WebSocket message types (for real-time updates)
export interface WebSocketMessage {
  type: 'upload_progress' | 'dashboard_update' | 'notification';
  payload: any;
}