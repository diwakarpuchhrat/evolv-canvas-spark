// EVOLV TypeScript Interfaces

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  username: string;
}

export interface Evolution {
  id: string;
  step: number;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  params?: {
    steps?: number;
    guidanceScale?: number;
    strength?: number;
    seed?: number;
  };
}

export interface Artwork {
  id: string;
  ownerId: string;
  title: string;
  baseImageUrl: string;
  coverImageUrl: string;
  public: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  evolutions: Evolution[];
  size: 'small' | 'medium' | 'large';
}

export interface JobStatus {
  id: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  progress?: number;
  resultUrl?: string;
  error?: string;
}

export interface EvolveRequest {
  artworkId: string;
  prompt: string;
  params?: {
    steps?: number;
    guidanceScale?: number;
    strength?: number;
    seed?: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}