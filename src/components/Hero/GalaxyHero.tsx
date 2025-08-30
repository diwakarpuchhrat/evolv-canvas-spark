'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '@/lib/animations/variants';
import { GalaxyCanvas } from '@/lib/r3f/GalaxyCanvas';

export const GalaxyHero = () => {
  const navigate = useNavigate();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const FallbackBackground = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg/90 to-primary/20">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse delay-200"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-accent/80 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary/50 rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {!reduceMotion ? (
          <Suspense fallback={<FallbackBackground />}>
            <GalaxyCanvas pixelIntensity={8} />
          </Suspense>
        ) : (
          <FallbackBackground />
        )}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          EVOLV
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Transform your ideas into extraordinary art with AI-powered evolution
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            size="lg"
            className="px-8 py-4 text-lg font-semibold rounded-full shadow-glow hover:shadow-glow/80 transition-all hover:-translate-y-1"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 text-lg font-semibold rounded-full border-2 hover:bg-accent/10 transition-all hover:-translate-y-1"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="px-8 py-4 text-lg font-semibold rounded-full hover:bg-accent/5 transition-all hover:-translate-y-1"
            onClick={() => navigate('/app/gallery')}
          >
            Explore
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/50 rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
};