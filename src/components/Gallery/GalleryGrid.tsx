'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { NFTCard } from './NFTCard';
import { useArtworksQuery } from '@/hooks/useArtworksQuery';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { staggerContainer } from '@/lib/animations/variants';

export const GalleryGrid = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useArtworksQuery({ pageSize: 12 });

  const [columns, setColumns] = useState(3);
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Responsive columns
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) setColumns(1);
      else if (window.innerWidth < 1024) setColumns(2);
      else if (window.innerWidth < 1536) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading gallery...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Failed to load gallery</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const allArtworks = data?.pages.flatMap(page => page.data) ?? [];

  // Distribute artworks across columns for masonry layout
  const columnArrays: typeof allArtworks[] = Array.from({ length: columns }, () => []);
  
  allArtworks.forEach((artwork, index) => {
    const columnIndex = index % columns;
    columnArrays[columnIndex].push(artwork);
  });

  return (
    <div className="w-full">
      <motion.div
        className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {columnArrays.map((columnArtworks, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {columnArtworks.map((artwork, artworkIndex) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: (columnIndex * 0.1) + (artworkIndex * 0.05) 
                }}
              >
                <NFTCard artwork={artwork} />
              </motion.div>
            ))}
          </div>
        ))}
      </motion.div>

      {/* Load more trigger */}
      <div 
        ref={loadMoreRef} 
        className="flex items-center justify-center py-12"
      >
        {isFetchingNextPage && (
          <div className="flex items-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-muted-foreground">Loading more...</span>
          </div>
        )}
        
        {!hasNextPage && allArtworks.length > 0 && (
          <p className="text-muted-foreground">You've reached the end!</p>
        )}
      </div>
    </div>
  );
};