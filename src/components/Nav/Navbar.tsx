'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProfileMenu } from '@/components/Profile/ProfileMenu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { useUserQuery } from '@/hooks/useUserQuery';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { data: user } = useUserQuery();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAppRoute = location.pathname.startsWith('/app');
  const isHomePage = location.pathname === '/';

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isAppRoute
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm'
          : 'bg-transparent'
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-black tracking-tight text-primary hover:text-primary/80 transition-colors"
        >
          EVOLV
        </Link>

        {/* Center Navigation - Only on app pages */}
        {isAppRoute && (
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/app" 
              className={cn(
                'text-sm font-medium transition-colors story-link',
                location.pathname === '/app' 
                  ? 'text-primary' 
                  : 'text-foreground/80 hover:text-foreground'
              )}
            >
              Dashboard
            </Link>
            <Link 
              to="/app/gallery" 
              className={cn(
                'text-sm font-medium transition-colors story-link',
                location.pathname === '/app/gallery' 
                  ? 'text-primary' 
                  : 'text-foreground/80 hover:text-foreground'
              )}
            >
              Gallery
            </Link>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {isHomePage ? (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <ProfileMenu user={user} />
          )}
        </div>
      </nav>
    </motion.header>
  );
};