'use client';

import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import Link from 'next/link';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    duration: string;
  };
  delay?: number;
}

export default function VideoCard({ video, delay = 0 }: VideoCardProps) {
  return (
    <GlassCard delay={delay}>
      <div className="flex flex-col h-full gap-4">
        {/* Thumbnail with Play Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay }}
          viewport={{ once: true }}
          className="relative w-full aspect-video bg-black/50 rounded-xl overflow-hidden group cursor-pointer"
        >
          {/* Fallback gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />

          {/* Thumbnail Image */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Play Button Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-3xl">▶️</span>
            </motion.div>
          </motion.div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-xs font-semibold text-white">
            {video.duration}
          </div>
        </motion.div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white line-clamp-2">{video.title}</h3>

        {/* Description */}
        <p className="text-foreground/70 text-sm flex-grow line-clamp-3">{video.description}</p>

        {/* Watch Button */}
        <motion.a
          href={video.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg font-semibold hover:bg-primary/20 transition-all duration-300 text-center"
        >
          Watch Video
        </motion.a>
      </div>
    </GlassCard>
  );
}
