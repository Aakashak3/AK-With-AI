'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from './GlassCard';
import Image from 'next/image';

interface ServiceCardProps {
  service: {
    id: string;
    icon: string;
    title: string;
    description: string;
    image_url?: string | null;
    included: string[];
    cta: {
      text: string;
      href: string;
    };
  };
  delay?: number;
}

export default function ServiceCard({ service, delay = 0 }: ServiceCardProps) {
  return (
    <GlassCard delay={delay} className="p-6 overflow-hidden h-full">
      <div className="flex flex-col h-full items-center text-center">
        {/* Service Image (Circular Icon) */}
        <div className="relative w-24 h-24 mb-6 rounded-full border-2 border-primary/30 p-1 bg-black/20 overflow-hidden flex items-center justify-center flex-shrink-0">
          {service.image_url ? (
            <div className="relative w-full h-full rounded-full overflow-hidden">
              {service.image_url.match(/\.(mp4|webm|ogg)$/i) || service.image_url.includes('video') ? (
                <video
                  src={service.image_url}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={service.image_url}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay }}
              className="text-4xl"
            >
              {service.icon}
            </motion.div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 min-h-[3.5rem] flex items-center">{service.title}</h3>

        {/* Description */}
        <p className="text-foreground/70 text-sm leading-relaxed mb-6 flex-1">
          {service.description}
        </p>

        {/* CTA Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-auto"
        >
          <Link
            href={service.cta.href}
            className="w-full inline-block px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold rounded-lg shadow-neon hover:shadow-neon-lg transition-all duration-300"
          >
            {service.cta.text}
          </Link>
        </motion.div>
      </div>
    </GlassCard>
  );
}
