'use client';

import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import { useState } from 'react';

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    image_url?: string | null;
    delay?: number;
  };
  delay?: number;
}

export default function PromptCard({ prompt, delay = 0 }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Image: '🖼️',
      Video: '🎥',
      Coding: '💻',
    };
    return icons[category] || '✨';
  };

  return (
    <GlassCard delay={delay}>
      <div className="flex flex-col h-full gap-6 items-center text-center">
        {/* Centered Image / Icon */}
        {/* Centered Image / Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: (delay || 0) + 0.1 }}
          viewport={{ once: true }}
          className="w-full h-48 rounded-lg overflow-hidden border-2 border-primary/30 relative bg-black/20 mb-4"
        >
          {prompt.image_url ? (
            prompt.image_url.match(/\.(mp4|webm|ogg)$/i) || prompt.image_url.includes('video') ? (
              <video
                src={prompt.image_url}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={prompt.image_url}
                alt={prompt.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <span className="text-5xl">{getCategoryIcon(prompt.category)}</span>
            </div>
          )}
        </motion.div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-white">{prompt.title}</h3>

        {/* Description */}
        <p className="text-foreground/70 text-sm max-w-xl">{prompt.description}</p>

        {/* Copy Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className={`w-full md:w-3/4 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${copied
            ? 'bg-primary/20 text-primary'
            : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
            }`}
        >
          {copied ? '✓ Copied!' : '📋 Copy Prompt'}
        </motion.button>
      </div>
    </GlassCard>
  );
}
