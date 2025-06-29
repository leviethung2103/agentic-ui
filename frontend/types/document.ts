export interface Document {
  id: string;
  name: string;
  path: string;
  userId: string;
  ownerName: string;
  size: number;
  permission: 'public' | 'private';
  createdAt: string;
} 