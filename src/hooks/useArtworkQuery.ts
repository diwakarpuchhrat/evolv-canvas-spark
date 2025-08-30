import { useQuery } from '@tanstack/react-query';
import { Artwork } from '@/types';
import { allMockArtworks } from '@/data/mocks/artworks';

// Mock API function
const fetchArtwork = async (artworkId: string): Promise<Artwork | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const artwork = allMockArtworks.find(art => art.id === artworkId);
  return artwork || null;
};

export const useArtworkQuery = (artworkId: string) => {
  return useQuery({
    queryKey: ['artwork', artworkId],
    queryFn: () => fetchArtwork(artworkId),
    enabled: !!artworkId,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};