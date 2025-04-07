
import { 
  PermissionType, 
  CallLogEntry, 
  MessageEntry, 
  FileEntry, 
  ContactEntry, 
  LocationEntry 
} from './types';

// Names for realistic data generation
const names = [
  'John Smith', 'Emma Johnson', 'Michael Brown', 'Olivia Davis', 'William Wilson',
  'Sophia Martinez', 'James Taylor', 'Isabella Anderson', 'Robert Thomas', 'Ava Garcia',
  'David Rodriguez', 'Mia Lopez', 'Joseph Lee', 'Charlotte Lewis', 'Thomas Walker',
  'Amelia Hall', 'Daniel Allen', 'Harper Young', 'Matthew King', 'Evelyn Scott'
];

// Message templates for generating realistic messages
const messageTemplates = [
  'Hey, how are you doing?',
  'Can we meet up later today?',
  'Don\'t forget about our meeting tomorrow!',
  'Did you see the news today?',
  'Thanks for your help yesterday.',
  'Happy birthday! 🎂',
  'I\'ll be there in 10 minutes.',
  'Could you send me that file we discussed?',
  'Are you free this weekend?',
  'Just checking in. How\'s everything?'
];

// File types for generating realistic file data
const fileTypes = [
  { extension: 'pdf', type: 'application/pdf' },
  { extension: 'docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { extension: 'jpg', type: 'image/jpeg' },
  { extension: 'png', type: 'image/png' },
  { extension: 'mp4', type: 'video/mp4' },
  { extension: 'xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { extension: 'txt', type: 'text/plain' },
  { extension: 'mp3', type: 'audio/mpeg' }
];

// City coordinates for generating realistic location data
const cityCoordinates = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
  { name: 'Houston', lat: 29.7604, lng: -95.3698 },
  { name: 'Phoenix', lat: 33.4484, lng: -112.0740 },
  { name: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
  { name: 'San Antonio', lat: 29.4241, lng: -98.4936 },
  { name: 'San Diego', lat: 32.7157, lng: -117.1611 },
  { name: 'Dallas', lat: 32.7767, lng: -96.7970 },
  { name: 'San Jose', lat: 37.3382, lng: -121.8863 }
];

class VirtualRAM {
  private static instance: VirtualRAM;
  private cache: Map<string, any[]> = new Map();
  
  private constructor() {
    // Initialize the cache with empty arrays for each permission type
    this.cache.set('CALL_LOGS', []);
    this.cache.set('MESSAGES', []);
    this.cache.set('FILE_ACCESS', []);
    this.cache.set('CONTACTS', []);
    this.cache.set('LOCATION', []);
    
    // Pre-generate some data
    this.preGenerateData();
  }
  
  public static getInstance(): VirtualRAM {
    if (!VirtualRAM.instance) {
      VirtualRAM.instance = new VirtualRAM();
    }
    return VirtualRAM.instance;
  }
  
  private preGenerateData(): void {
    // Generate 20 call logs
    for (let i = 0; i < 20; i++) {
      this.cache.get('CALL_LOGS')?.push(this.generateCallLog());
    }
    
    // Generate 20 messages
    for (let i = 0; i < 20; i++) {
      this.cache.get('MESSAGES')?.push(this.generateMessage());
    }
    
    // Generate 20 files
    for (let i = 0; i < 20; i++) {
      this.cache.get('FILE_ACCESS')?.push(this.generateFile());
    }
    
    // Generate 20 contacts
    for (let i = 0; i < 20; i++) {
      this.cache.get('CONTACTS')?.push(this.generateContact());
    }
    
    // Generate 20 locations
    for (let i = 0; i < 20; i++) {
      this.cache.get('LOCATION')?.push(this.generateLocation());
    }
  }
  
  private getRandomPhoneNumber(): string {
    const areaCode = Math.floor(Math.random() * 800) + 200;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const lineNumber = Math.floor(Math.random() * 9000) + 1000;
    return `${areaCode}-${prefix}-${lineNumber}`;
  }
  
  private getRandomName(): string {
    return names[Math.floor(Math.random() * names.length)];
  }
  
  private getRandomMessage(): string {
    return messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
  }
  
  private getRandomDate(daysBack: number = 30): Date {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * daysBack);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);
    
    now.setDate(now.getDate() - randomDays);
    now.setHours(randomHours, randomMinutes, randomSeconds);
    
    return now;
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  private generateCallLog(): CallLogEntry {
    const directions = ['INCOMING', 'OUTGOING', 'MISSED'] as const;
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const duration = direction === 'MISSED' ? 0 : Math.floor(Math.random() * 600) + 10; // 10 to 610 seconds
    
    return {
      id: this.generateId(),
      phoneNumber: this.getRandomPhoneNumber(),
      name: Math.random() > 0.3 ? this.getRandomName() : null, // 30% chance of unknown caller
      direction: direction,
      timestamp: this.getRandomDate(),
      duration: duration
    };
  }
  
  private generateMessage(): MessageEntry {
    const directions = ['INCOMING', 'OUTGOING'] as const;
    
    return {
      id: this.generateId(),
      phoneNumber: this.getRandomPhoneNumber(),
      name: Math.random() > 0.3 ? this.getRandomName() : null, // 30% chance of unknown sender
      direction: directions[Math.floor(Math.random() * directions.length)],
      timestamp: this.getRandomDate(),
      content: this.getRandomMessage()
    };
  }
  
  private generateFile(): FileEntry {
    const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const fileName = `file_${Math.floor(Math.random() * 1000)}.${fileType.extension}`;
    const dirNames = ['Documents', 'Downloads', 'Pictures', 'Videos', 'Music'];
    const dirPath = `/virtual/${dirNames[Math.floor(Math.random() * dirNames.length)]}`;
    
    return {
      id: this.generateId(),
      path: `${dirPath}/${fileName}`,
      name: fileName,
      size: Math.floor(Math.random() * 10000000) + 1000, // 1KB to 10MB
      type: fileType.type,
      lastModified: this.getRandomDate(60) // Files can be older
    };
  }
  
  private generateContact(): ContactEntry {
    const name = this.getRandomName();
    const nameParts = name.split(' ');
    const email = Math.random() > 0.2 ? // 20% chance of no email
      `${nameParts[0].toLowerCase()}.${nameParts[1].toLowerCase()}@example.com` : null;
    
    return {
      id: this.generateId(),
      name: name,
      phoneNumber: this.getRandomPhoneNumber(),
      email: email,
      avatar: Math.random() > 0.5 ? // 50% chance of having an avatar
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}` : null
    };
  }
  
  private generateLocation(): LocationEntry {
    const city = cityCoordinates[Math.floor(Math.random() * cityCoordinates.length)];
    // Add some random offset to the coordinates (within about 5km)
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;
    
    return {
      id: this.generateId(),
      latitude: city.lat + latOffset,
      longitude: city.lng + lngOffset,
      accuracy: Math.floor(Math.random() * 50) + 10, // 10-60 meters accuracy
      timestamp: this.getRandomDate(3) // Locations are more recent
    };
  }
  
  public generateData(permissionType: PermissionType, count: number = 1): any[] {
    const result: any[] = [];
    
    for (let i = 0; i < count; i++) {
      switch (permissionType) {
        case 'CALL_LOGS':
          result.push(this.generateCallLog());
          break;
        case 'MESSAGES':
          result.push(this.generateMessage());
          break;
        case 'FILE_ACCESS':
          result.push(this.generateFile());
          break;
        case 'CONTACTS':
          result.push(this.generateContact());
          break;
        case 'LOCATION':
          result.push(this.generateLocation());
          break;
      }
    }
    
    // Add to cache
    const cachedData = this.cache.get(permissionType) || [];
    this.cache.set(permissionType, [...cachedData, ...result]);
    
    return result;
  }
  
  public getData(permissionType: PermissionType, count: number = 5): any[] {
    const cachedData = this.cache.get(permissionType) || [];
    
    // If we don't have enough data in the cache, generate more
    if (cachedData.length < count) {
      const neededCount = count - cachedData.length;
      this.generateData(permissionType, neededCount);
    }
    
    // Return a random sample from the cache
    const data = [...(this.cache.get(permissionType) || [])];
    const result: any[] = [];
    
    for (let i = 0; i < count; i++) {
      if (data.length === 0) break;
      const randomIndex = Math.floor(Math.random() * data.length);
      result.push(data[randomIndex]);
      data.splice(randomIndex, 1); // Remove the selected item to avoid duplicates
    }
    
    return result;
  }
}

export default VirtualRAM;
