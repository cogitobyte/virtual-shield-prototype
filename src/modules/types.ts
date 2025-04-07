
// Permission Types
export type PermissionType = 'CALL_LOGS' | 'MESSAGES' | 'FILE_ACCESS' | 'CONTACTS' | 'LOCATION';

// App Information
export interface App {
  id: string;
  name: string;
  icon: string;
  trusted: boolean;
}

// Permission Request
export interface PermissionRequest {
  id: string;
  timestamp: Date;
  appId: string;
  permissionType: PermissionType;
  status: 'PENDING' | 'GRANTED' | 'DENIED';
}

// Permission Response
export interface PermissionResponse {
  requestId: string;
  timestamp: Date;
  granted: boolean;
  data: any | null;
  message: string;
}

// Log Entry
export interface LogEntry {
  id: string;
  timestamp: Date;
  requestId: string;
  appId: string;
  appName: string;
  permissionType: PermissionType;
  status: 'GRANTED' | 'DENIED';
  data: any | null;
  message: string;
}

// Call Log
export interface CallLogEntry {
  id: string;
  phoneNumber: string;
  name: string | null;
  direction: 'INCOMING' | 'OUTGOING' | 'MISSED';
  timestamp: Date;
  duration: number; // seconds
}

// Message
export interface MessageEntry {
  id: string;
  phoneNumber: string;
  name: string | null;
  direction: 'INCOMING' | 'OUTGOING';
  timestamp: Date;
  content: string;
}

// File
export interface FileEntry {
  id: string;
  path: string;
  name: string;
  size: number;
  type: string;
  lastModified: Date;
}

// Contact
export interface ContactEntry {
  id: string;
  name: string;
  phoneNumber: string;
  email: string | null;
  avatar: string | null;
}

// Location
export interface LocationEntry {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}
