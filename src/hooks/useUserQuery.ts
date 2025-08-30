import { useQuery } from '@tanstack/react-query';
import { User } from '@/types';
import { mockUser } from '@/data/mocks/users';

// Mock API function
const fetchUser = async (): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockUser;
};

export const useUserQuery = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes (previously cacheTime)
  });
};