import { User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex@evolv.dev',
  username: 'alexc',
  avatarUrl: '/api/placeholder/40/40'
};

export const mockUsers: User[] = [
  mockUser,
  {
    id: '2',
    name: 'Sam Rivera',
    email: 'sam@evolv.dev',
    username: 'samr',
    avatarUrl: '/api/placeholder/40/40'
  },
  {
    id: '3',
    name: 'Maya Patel',
    email: 'maya@evolv.dev',
    username: 'mayap',
    avatarUrl: '/api/placeholder/40/40'
  }
];