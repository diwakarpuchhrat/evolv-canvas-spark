import { Artwork, Evolution } from '@/types';

// Mock evolution data
const createEvolution = (step: number, prompt: string): Evolution => ({
  id: `evo-${Date.now()}-${step}`,
  step,
  prompt,
  imageUrl: `/api/placeholder/512/512?text=Evolution${step}`,
  createdAt: new Date(Date.now() - step * 3600000).toISOString(),
  params: {
    steps: 50,
    guidanceScale: 7.5,
    strength: 0.8,
    seed: Math.floor(Math.random() * 1000000)
  }
});

// Generate mock artworks with various sizes for masonry layout
export const mockArtworks: Artwork[] = [
  {
    id: '1',
    ownerId: '1',
    title: 'Cyberpunk Cityscape',
    baseImageUrl: '/api/placeholder/512/768',
    coverImageUrl: '/api/placeholder/512/768',
    public: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    tags: ['cyberpunk', 'city', 'neon'],
    size: 'large',
    evolutions: [
      createEvolution(1, 'A futuristic cyberpunk cityscape with neon lights'),
      createEvolution(2, 'Add flying cars and holographic advertisements'),
      createEvolution(3, 'Make it rain with more atmospheric effects')
    ]
  },
  {
    id: '2',
    ownerId: '1',
    title: 'Abstract Portrait',
    baseImageUrl: '/api/placeholder/400/400',
    coverImageUrl: '/api/placeholder/400/400',
    public: true,
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T18:30:00Z',
    tags: ['portrait', 'abstract', 'art'],
    size: 'medium',
    evolutions: [
      createEvolution(1, 'Abstract geometric portrait with vibrant colors'),
      createEvolution(2, 'Add more geometric patterns and depth')
    ]
  },
  {
    id: '3',
    ownerId: '2',
    title: 'Dragon Fantasy',
    baseImageUrl: '/api/placeholder/600/400',
    coverImageUrl: '/api/placeholder/600/400',
    public: true,
    createdAt: '2024-01-13T12:20:00Z',
    updatedAt: '2024-01-13T15:10:00Z',
    tags: ['dragon', 'fantasy', 'medieval'],
    size: 'medium',
    evolutions: [
      createEvolution(1, 'A majestic dragon soaring over medieval castle'),
      createEvolution(2, 'Add fire breathing and more dramatic lighting'),
      createEvolution(3, 'Include knights on the ground looking up'),
      createEvolution(4, 'Make the scene more epic with storm clouds')
    ]
  },
  {
    id: '4',
    ownerId: '1',
    title: 'Minimalist Nature',
    baseImageUrl: '/api/placeholder/350/500',
    coverImageUrl: '/api/placeholder/350/500',
    public: true,
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-12T11:45:00Z',
    tags: ['nature', 'minimalist', 'zen'],
    size: 'small',
    evolutions: [
      createEvolution(1, 'Minimalist zen garden with single tree'),
      createEvolution(2, 'Add subtle morning mist and soft lighting')
    ]
  },
  {
    id: '5',
    ownerId: '3',
    title: 'Space Odyssey',
    baseImageUrl: '/api/placeholder/500/700',
    coverImageUrl: '/api/placeholder/500/700',
    public: true,
    createdAt: '2024-01-11T14:30:00Z',
    updatedAt: '2024-01-11T17:20:00Z',
    tags: ['space', 'stars', 'cosmic'],
    size: 'large',
    evolutions: [
      createEvolution(1, 'Deep space with nebulae and distant galaxies'),
      createEvolution(2, 'Add a lone spaceship exploring the cosmos'),
      createEvolution(3, 'Include a mysterious alien structure')
    ]
  },
  {
    id: '6',
    ownerId: '2',
    title: 'Urban Sketches',
    baseImageUrl: '/api/placeholder/380/300',
    coverImageUrl: '/api/placeholder/380/300',
    public: true,
    createdAt: '2024-01-10T08:45:00Z',
    updatedAt: '2024-01-10T10:30:00Z',
    tags: ['urban', 'sketch', 'street'],
    size: 'small',
    evolutions: [
      createEvolution(1, 'Quick urban street scene sketch style'),
      createEvolution(2, 'Add more pedestrians and street life')
    ]
  },
  {
    id: '7',
    ownerId: '1',
    title: 'Crystal Caves',
    baseImageUrl: '/api/placeholder/450/600',
    coverImageUrl: '/api/placeholder/450/600',
    public: true,
    createdAt: '2024-01-09T13:20:00Z',
    updatedAt: '2024-01-09T16:15:00Z',
    tags: ['crystal', 'cave', 'magical'],
    size: 'medium',
    evolutions: [
      createEvolution(1, 'Mystical crystal cave with glowing formations'),
      createEvolution(2, 'Add an explorer with a lantern'),
      createEvolution(3, 'Include magical floating crystals')
    ]
  },
  {
    id: '8',
    ownerId: '3',
    title: 'Vintage Car',
    baseImageUrl: '/api/placeholder/520/350',
    coverImageUrl: '/api/placeholder/520/350',
    public: true,
    createdAt: '2024-01-08T11:10:00Z',
    updatedAt: '2024-01-08T13:45:00Z',
    tags: ['vintage', 'car', 'retro'],
    size: 'medium',
    evolutions: [
      createEvolution(1, 'Classic 1960s muscle car in pristine condition'),
      createEvolution(2, 'Set it on a desert highway at sunset')
    ]
  }
];

// Generate more artworks for infinite scroll testing
const generateMoreArtworks = (): Artwork[] => {
  const templates = [
    { title: 'Ocean Waves', tags: ['ocean', 'nature', 'blue'] },
    { title: 'Mountain Peak', tags: ['mountain', 'landscape', 'snow'] },
    { title: 'Forest Path', tags: ['forest', 'path', 'green'] },
    { title: 'Desert Dunes', tags: ['desert', 'sand', 'golden'] },
    { title: 'City Lights', tags: ['city', 'night', 'lights'] },
    { title: 'Flower Garden', tags: ['flowers', 'garden', 'colorful'] },
    { title: 'Starry Night', tags: ['stars', 'night', 'sky'] },
    { title: 'Ancient Ruins', tags: ['ruins', 'ancient', 'historical'] }
  ];

  const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
  const owners = ['1', '2', '3'];

  return Array.from({ length: 50 }, (_, i) => {
    const template = templates[i % templates.length];
    const size = sizes[i % sizes.length];
    const ownerId = owners[i % owners.length];
    const id = `generated-${i + 9}`;

    // Vary dimensions based on size
    const dimensions = {
      small: { width: 300 + (i % 100), height: 400 + (i % 150) },
      medium: { width: 400 + (i % 150), height: 500 + (i % 200) },
      large: { width: 500 + (i % 200), height: 700 + (i % 250) }
    };

    const dim = dimensions[size];

    return {
      id,
      ownerId,
      title: `${template.title} ${i + 1}`,
      baseImageUrl: `/api/placeholder/${dim.width}/${dim.height}`,
      coverImageUrl: `/api/placeholder/${dim.width}/${dim.height}`,
      public: true,
      createdAt: new Date(Date.now() - (i + 9) * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - (i + 9) * 86400000 + 3600000).toISOString(),
      tags: template.tags,
      size,
      evolutions: [
        createEvolution(1, `Create a beautiful ${template.title.toLowerCase()}`)
      ]
    };
  });
};

export const allMockArtworks = [...mockArtworks, ...generateMoreArtworks()];