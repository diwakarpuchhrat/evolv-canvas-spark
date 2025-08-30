import { useInfiniteQuery } from '@tanstack/react-query';
import { Artwork, PaginatedResponse } from '@/types';
import { allMockArtworks } from '@/data/mocks/artworks';

interface ArtworksQueryParams {
  pageSize?: number;
}

// Mock API function
const fetchArtworks = async ({ 
  pageParam = 0,
  pageSize = 12 
}: { 
  pageParam: number;
  pageSize: number;
}): Promise<PaginatedResponse<Artwork>> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const start = pageParam * pageSize;
  const end = start + pageSize;
  const artworks = allMockArtworks.slice(start, end);
  
  return {
    data: artworks,
    page: pageParam,
    pageSize,
    total: allMockArtworks.length,
    hasMore: end < allMockArtworks.length
  };
};

export const useArtworksQuery = ({ pageSize = 12 }: ArtworksQueryParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['artworks', pageSize],
    queryFn: ({ pageParam = 0 }) => fetchArtworks({ pageParam, pageSize }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};