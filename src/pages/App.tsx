import { MainLayout } from '@/components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/animations/variants';
import { useUserQuery } from '@/hooks/useUserQuery';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GalleryGrid } from '@/components/Gallery/GalleryGrid';
import { GenerateNFT } from './GenerateNFT';

const App = () => {
  const { data: user, isLoading } = useUserQuery();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">
            Please log in to view your dashboard.
          </p>
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
        transition={{ duration: 0.36 }}
      >
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-10">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-2xl bg-primary/10">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        {/* NFTs (using same gallery grid) */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your NFTs</h2>
          <GalleryGrid />
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default App;
