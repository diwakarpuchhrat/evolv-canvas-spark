'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Share, Download, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PromptChat } from '@/components/Chat/PromptChat';
import { scaleIn, fadeInUp } from '@/lib/animations/variants';
import { cn } from '@/lib/utils';
import type { Artwork } from '@/types';

interface ArtworkViewProps {
  artwork: Artwork;
}

export const ArtworkView = ({ artwork }: ArtworkViewProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  const handleResetView = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    const startX = e.clientX - panPosition.x;
    const startY = e.clientY - panPosition.y;

    const handleMouseMove = (e: MouseEvent) => {
      setPanPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      });
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Main Artwork Display */}
      <motion.div 
        className="xl:col-span-2"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="glass-panel rounded-lg p-6 shadow-float">
          {/* Artwork Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button size="sm" variant="outline" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleResetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={isLiked ? "default" : "outline"}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              </Button>
              <Button size="sm" variant="outline">
                <Share className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Artwork Container */}
          <div className="relative bg-background/50 rounded-lg overflow-hidden aspect-square border border-border/50">
            <div
              className={cn(
                'w-full h-full flex items-center justify-center',
                isPanning ? 'cursor-grabbing' : 'cursor-grab'
              )}
              onMouseDown={handleMouseDown}
            >
              <img
                src={artwork.baseImageUrl}
                alt={artwork.title}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`
                }}
                onLoad={() => console.log('Artwork loaded')}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sidebar with Metadata */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Artwork Info */}
        <div className="glass-panel rounded-lg p-6 shadow-soft">
          <h1 className="text-2xl font-bold mb-2">{artwork.title}</h1>
          <p className="text-muted-foreground mb-4">
            Created by Owner #{artwork.ownerId}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <p className="font-medium">
                {new Date(artwork.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Updated:</span>
              <p className="font-medium">
                {new Date(artwork.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Evolutions:</span>
              <p className="font-medium">{artwork.evolutions.length}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <p className="font-medium">{artwork.public ? 'Public' : 'Private'}</p>
            </div>
          </div>

          {/* Tags */}
          {artwork.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Evolution History */}
        <div className="glass-panel rounded-lg p-6 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">Evolution History</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {artwork.evolutions.map((evolution, index) => (
              <motion.div
                key={evolution.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src={evolution.imageUrl}
                  alt={`Evolution ${evolution.step}`}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-1">
                    Step {evolution.step}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {evolution.prompt}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(evolution.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Chat Section - Full Width */}
      <div className="xl:col-span-3">
        <PromptChat artworkId={artwork.id} />
      </div>
    </div>
  );
};