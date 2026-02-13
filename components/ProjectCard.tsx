'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    image: string;
    demoUrl: string;
    tags: string[];
  };
  delay?: number;
}

export default function ProjectCard({ project, delay = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group glass glass-hover rounded-2xl overflow-hidden h-full flex flex-col relative z-10"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 md:h-56 bg-black/20 flex-shrink-0">
        {project.image.match(/\.(mp4|webm|ogg)$/i) || project.image.includes('video') ? (
          <video
            src={project.image}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col p-6 gap-4 justify-between">
        {/* Text Content */}
        <div className="flex-1 flex flex-col gap-3">
          <h3 className="text-lg font-bold text-white line-clamp-2">{project.title}</h3>
          <p className="text-foreground/70 text-sm line-clamp-3">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs font-semibold bg-primary/20 text-primary border border-primary/30 rounded-full flex-shrink-0"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Live Demo Button - Isolated */}
        <div className="pt-2 flex-shrink-0">
          <motion.a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="block w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg text-center shadow-neon hover:shadow-neon-lg transition-all duration-300 pointer-events-auto relative z-20"
          >
            🚀 Live Demo
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
