import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useOwnedArtworksQuery = (userId?: string) => {
  return useQuery({
    queryKey: ['ownedArtworks', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await axios.get(`/api/users/${userId}/artworks`);
      return data; // expect array of artworks
    },
    enabled: !!userId,
  });
};
