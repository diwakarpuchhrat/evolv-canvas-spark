'use client';

import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cardHoverVariants } from '@/lib/animations/variants';
import { cn } from '@/lib/utils';
import type { Artwork } from '@/types';

interface NFTCardProps {
  artwork: Artwork;
}

export const NFTCard = ({ artwork }: NFTCardProps) => {
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleClick = () => {
    navigate(`/app/artwork/${artwork.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  // Get appropriate aspect ratio class based on artwork size
  const getAspectRatio = () => {
    switch (artwork.size) {
      case 'small':
        return 'aspect-[3/4]';
      case 'large':
        return 'aspect-[2/3]';
      default:
        return 'aspect-square';
    }
  };

  return (
    <motion.div
      className={cn(
        'group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg',
        'transition-all duration-300'
      )}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      variants={{ initial: { scale: 1 }, hover: { scale: 1.03 } }}
      initial="initial"
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View artwork: ${artwork.title}`}
    >
      <div className="glass-panel rounded-lg overflow-hidden shadow-soft group-hover:shadow-glow transition-all duration-300">
        {/* Image Container */}
        <div className={cn('relative overflow-hidden bg-muted', getAspectRatio())}>
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
          )}
          
          <img
            src={artwork.coverImageUrl}
            alt={artwork.title}
            className={cn(
              'w-full h-full object-cover transition-all duration-500',
              'group-hover:scale-110',
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />

          {/* Hover Overlay */}
          <div className={cn(
            'absolute inset-0 bg-black/0 group-hover:bg-black/20',
            'transition-all duration-300',
            'flex items-center justify-center'
          )}>
            <div className={cn(
              'flex items-center space-x-4 opacity-0 group-hover:opacity-100',
              'transition-all duration-300 transform translate-y-4 group-hover:translate-y-0'
            )}>
              <motion.button
                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Like artwork:', artwork.id);
                }}
                aria-label="Like artwork"
              >
                <Heart className="h-4 w-4" />
              </motion.button>
              
              <motion.button
                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Quick preview:', artwork.id);
                }}
                aria-label="Quick preview"
              >
                <Eye className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {artwork.title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-3 w-3 mr-1" />
              <span>Owner #{artwork.ownerId}</span>
            </div>
            
            <span className="text-xs text-muted-foreground">
              {artwork.evolutions.length} evolution{artwork.evolutions.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Tags */}
          {artwork.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {artwork.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {artwork.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{artwork.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};