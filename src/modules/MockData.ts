
import { App } from './types';

// Mock apps
export const MOCK_APPS: App[] = [
  {
    id: 'app1',
    name: 'Social Connect',
    icon: 'message-circle',
    trusted: true
  },
  {
    id: 'app2',
    name: 'Maps Navigator',
    icon: 'map-pin',
    trusted: true
  },
  {
    id: 'app3',
    name: 'Photo Editor',
    icon: 'image',
    trusted: true
  },
  {
    id: 'app4',
    name: 'Data Harvester',
    icon: 'database',
    trusted: false
  },
  {
    id: 'app5',
    name: 'Weather Forecast',
    icon: 'cloud',
    trusted: true
  }
];

// Permission descriptions
export const PERMISSION_DESCRIPTIONS = {
  'CALL_LOGS': {
    title: 'Call Logs',
    description: 'Access to your phone call history',
    icon: 'phone'
  },
  'MESSAGES': {
    title: 'Messages',
    description: 'Access to your SMS and messaging history',
    icon: 'message-square'
  },
  'FILE_ACCESS': {
    title: 'File Access',
    description: 'Access to your files and documents',
    icon: 'folder'
  },
  'CONTACTS': {
    title: 'Contacts',
    description: 'Access to your contacts and address book',
    icon: 'users'
  },
  'LOCATION': {
    title: 'Location',
    description: 'Access to your device location',
    icon: 'map-pin'
  }
};
