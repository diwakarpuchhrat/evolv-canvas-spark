// src/sampleArtworks.ts
import type { Artwork } from '@/types';

export const sampleArtworks: Artwork[] = Array.from({ length: 20 }, (_, i) => {
  const id = String(i + 1);
  return {
    id,
    title: `Sample NFT #${id}`,
    coverImageUrl: `/sample-nfts/${id}.png`,
    ownerId: String(100 + i + 1),
    size: 'small',
    evolutions: [],
    tags: ['punk', 'sample']
  } as Artwork;
});
