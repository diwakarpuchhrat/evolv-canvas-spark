'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wand2, Save, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { scaleIn } from '@/lib/animations/variants';
import { cn } from '@/lib/utils';

export const GenerateNFT = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setImageUrl(null);

    try {
      // ⚡ Temporary mock — replace with call to /api/generate
      await new Promise((res) => setTimeout(res, 2000));
      setImageUrl('/sample-nfts/cryptopunk975.png'); // placeholder result
    } catch (err) {
      console.error('Generation failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!imageUrl) return;
    console.log('Save NFT:', { prompt, imageUrl });
    // Later: send to backend → store as Artwork
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left: Prompt + Controls */}
      <motion.div
        className="xl:col-span-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="glass-panel rounded-lg p-6 shadow-soft space-y-4">
          <h1 className="text-2xl font-bold mb-2">Generate New NFT</h1>
          <p className="text-muted-foreground text-sm mb-4">
            Enter a creative prompt and let the AI generate your unique NFT.
          </p>

          <Input
            placeholder="e.g. cyberpunk samurai in neon city"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="flex space-x-2 pt-4">
            <Button
              onClick={handleGenerate}
              disabled={!prompt || isGenerating}
              className="flex items-center space-x-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              <span>Generate</span>
            </Button>
            {imageUrl && (
              <Button
                variant="secondary"
                onClick={handleSave}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Right: Image Preview */}
      <motion.div
        className="xl:col-span-2 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="glass-panel rounded-lg p-6 shadow-float w-full aspect-square flex items-center justify-center">
          {isGenerating ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Generating your NFT...</p>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Generated NFT"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : (
            <p className="text-muted-foreground text-center">
              Enter a prompt and click generate to preview your NFT here.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
