import { MainLayout } from '@/components/Layout/MainLayout';
import { GalleryGrid } from '@/components/Gallery/GalleryGrid';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '@/lib/animations/variants';

const Gallery = () => {
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Gallery</h1>
          <p className="text-muted-foreground text-lg">
            Discover amazing AI-generated artwork from the EVOLV community
          </p>
        </div>
        
        <GalleryGrid />
      </motion.div>
    </MainLayout>
  );
};

export default Gallery;