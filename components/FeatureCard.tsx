'use client';

import GlassCard from './GlassCard';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <GlassCard delay={delay}>
      <motion.div
        className="flex flex-col items-center text-center gap-4 h-full justify-between"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
        viewport={{ once: true }}
      >
        {/* Icon */}
        <motion.div
          className="text-5xl filter drop-shadow-lg"
          whileHover={{ scale: 1.2, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {icon}
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white">{title}</h3>

        {/* Description */}
        <p className="text-foreground/70 text-sm leading-relaxed">{description}</p>
      </motion.div>
    </GlassCard>
  );
}
