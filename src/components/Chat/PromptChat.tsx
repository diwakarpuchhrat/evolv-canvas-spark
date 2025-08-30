'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Settings, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useEvolveMutation } from '@/hooks/useEvolveMutation';
import { chatMessageVariants } from '@/lib/animations/variants';
import { cn } from '@/lib/utils';
import type { EvolveRequest } from '@/types';

interface PromptChatProps {
  artworkId: string;
}

interface AdvancedParams {
  steps: number;
  guidanceScale: number;
  strength: number;
  seed?: number;
}

export const PromptChat = ({ artworkId }: PromptChatProps) => {
  const [prompt, setPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [params, setParams] = useState<AdvancedParams>({
    steps: 50,
    guidanceScale: 7.5,
    strength: 0.8
  });

  const evolveMutation = useEvolveMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;

    const request: EvolveRequest = {
      artworkId,
      prompt: prompt.trim(),
      params: {
        steps: params.steps,
        guidanceScale: params.guidanceScale,
        strength: params.strength,
        seed: params.seed
      }
    };

    try {
      await evolveMutation.mutateAsync(request);
      setPrompt(''); // Clear prompt on success
    } catch (error) {
      console.error('Evolution failed:', error);
    }
  };

  const isLoading = evolveMutation.isPending;

  return (
    <motion.div
      className="glass-panel rounded-lg p-6 shadow-float"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Evolve This Artwork</h3>
        <p className="text-muted-foreground text-sm">
          Describe how you'd like to transform this artwork and create a new evolution.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="prompt">Transformation Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="Describe how you want to evolve this artwork... (e.g., 'Add a sunset sky with golden clouds' or 'Make it more futuristic with neon accents')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Advanced Settings Toggle */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full justify-between"
        >
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Settings
          </div>
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {/* Advanced Settings Panel */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              className="space-y-6 p-4 rounded-lg bg-background/50 border border-border/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Steps */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Inference Steps</Label>
                  <Badge variant="secondary">{params.steps}</Badge>
                </div>
                <Slider
                  value={[params.steps]}
                  onValueChange={([value]) => setParams(prev => ({ ...prev, steps: value }))}
                  min={10}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Higher values = better quality but slower generation
                </p>
              </div>

              {/* Guidance Scale */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Guidance Scale</Label>
                  <Badge variant="secondary">{params.guidanceScale}</Badge>
                </div>
                <Slider
                  value={[params.guidanceScale]}
                  onValueChange={([value]) => setParams(prev => ({ ...prev, guidanceScale: value }))}
                  min={1}
                  max={20}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  How closely to follow your prompt (7-12 recommended)
                </p>
              </div>

              {/* Strength */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Transformation Strength</Label>
                  <Badge variant="secondary">{params.strength}</Badge>
                </div>
                <Slider
                  value={[params.strength]}
                  onValueChange={([value]) => setParams(prev => ({ ...prev, strength: value }))}
                  min={0.1}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  How much to change the original image (0.7-0.9 recommended)
                </p>
              </div>

              {/* Seed */}
              <div className="space-y-2">
                <Label htmlFor="seed">Seed (Optional)</Label>
                <input
                  id="seed"
                  type="number"
                  placeholder="Random seed for reproducible results"
                  value={params.seed || ''}
                  onChange={(e) => setParams(prev => ({ 
                    ...prev, 
                    seed: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for random results
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Evolving Artwork...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Evolve Artwork
            </>
          )}
        </Button>
      </form>

      {/* Status Messages */}
      <AnimatePresence>
        {evolveMutation.isError && (
          <motion.div
            className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24 }}
          >
            <p className="text-sm text-destructive">
              Failed to evolve artwork. Please try again.
            </p>
          </motion.div>
        )}

        {evolveMutation.isSuccess && (
          <motion.div
            className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24 }}
          >
            <p className="text-sm text-primary">
              Evolution completed successfully! Check the evolution history above.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};