import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { ArtworkView } from '@/components/Artwork/ArtworkView';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '@/lib/animations/variants';
import { useArtworkQuery } from '@/hooks/useArtworkQuery';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: artwork, isLoading, error } = useArtworkQuery(id!);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading artwork...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !artwork) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artwork Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The artwork you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/app/gallery')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

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
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/app/gallery')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gallery
        </Button>

        <ArtworkView artwork={artwork} />
      </motion.div>
    </MainLayout>
  );
};

export default ArtworkDetail;