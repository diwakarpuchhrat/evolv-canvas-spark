'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  CreditCard, 
  Upload, 
  MessageSquare, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { profileMenuVariants } from '@/lib/animations/variants';
import { cn } from '@/lib/utils';
import type { User as UserType } from '@/types';

interface ProfileMenuProps {
  user?: UserType | null;
}

export const ProfileMenu = ({ user }: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Button variant="ghost" onClick={() => navigate('/login')}>
          Log In
        </Button>
        <Button onClick={() => navigate('/signup')}>
          Sign Up
        </Button>
      </div>
    );
  }

  const menuItems = [
    {
      icon: Settings,
      label: 'Account Settings',
      action: () => navigate('/settings')
    },
    {
      icon: CreditCard,
      label: 'Manage Subscription',
      action: () => console.log('Manage subscription')
    },
    {
      icon: Upload,
      label: 'Manage Uploads',
      action: () => navigate('/app/gallery')
    },
    {
      icon: MessageSquare,
      label: 'Go to Discord',
      action: () => window.open('https://discord.gg/evolv', '_blank')
    },
    {
      icon: LogOut,
      label: 'Log Out',
      action: () => {
        console.log('Logging out...');
        navigate('/');
      },
      danger: true
    }
  ];

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className={cn(
          'flex items-center space-x-2 px-3 py-2 h-auto',
          'hover:bg-accent/50 transition-colors',
          isOpen && 'bg-accent/50'
        )}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-medium text-foreground">
            {user.name}
          </span>
          <span className="text-xs text-muted-foreground">
            @{user.username}
          </span>
        </div>
        <ChevronDown 
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className={cn(
                'absolute right-0 top-full mt-2 w-64 z-50',
                'glass-panel rounded-lg shadow-float',
                'border border-border/50'
              )}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              role="menu"
              aria-orientation="vertical"
            >
              <div className="py-2">
                {menuItems.map((item, index) => (
                  <button
                    key={item.label}
                    className={cn(
                      'w-full flex items-center space-x-3 px-4 py-3',
                      'text-left text-sm font-medium',
                      'hover:bg-accent/50 transition-colors',
                      'focus:bg-accent/50 focus:outline-none',
                      item.danger 
                        ? 'text-destructive hover:text-destructive' 
                        : 'text-foreground'
                    )}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};