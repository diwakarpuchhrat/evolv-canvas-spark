import { MainLayout } from '@/components/Layout/MainLayout';
import { GalleryGrid } from '@/components/Gallery/GalleryGrid';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/animations/variants';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Gallery = () => {
  const navigate = useNavigate();

  const handleGenerateNFT = () => {
    navigate('/generate');
  };

  return (
    <MainLayout>
      <motion.div
        className="container mx-auto px-4 py-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.36 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Gallery</h1>
            <p className="text-muted-foreground text-lg">
              Discover amazing AI-generated artwork from the EVOLV community
            </p>
          </div>

          {/* ✅ Navigate to /generate */}
          <Button onClick={handleGenerateNFT} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Generate NFT</span>
          </Button>
        </div>
        
        <GalleryGrid />
      </motion.div>
    </MainLayout>
  );
};

export default Gallery;
