'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Ad {
    id: string;
    title: string;
    image_url: string;
    link_url: string;
    location: string;
}

interface AdBannerProps {
    location: 'youtube_top' | 'youtube_bottom' | 'prompts_bottom';
    className?: string;
}

export default function AdBanner({ location, className = '' }: AdBannerProps) {
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const { data, error } = await (supabase.from('ads') as any)
                    .select('*')
                    .eq('location', location)
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (error) throw error;
                if (data && data.length > 0) {
                    setAd(data[0]);
                }
            } catch (err) {
                console.error('Error fetching ad:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [location]);

    if (loading) return null;
    if (!ad) return null;

    const AdWrapper = ad.link_url ? 'a' : 'div';
    const wrapperProps = ad.link_url ? { href: ad.link_url, target: '_blank', rel: 'noopener noreferrer' } : {};

    const isVideo = ad.image_url.match(/\.(mp4|webm|ogg)$/i) || ad.image_url.includes('video');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative group ${className}`}
        >
            <AdWrapper {...(wrapperProps as any)} className="block relative aspect-[4/1] md:aspect-[8/1] w-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-white/20 transition-all duration-300">
                {isVideo ? (
                    <video
                        src={ad.image_url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <Image
                        src={ad.image_url}
                        alt={ad.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                )}
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-foreground/40 uppercase tracking-widest border border-white/10 pointer-events-none z-10">
                    Ad
                </div>

                {/* Hover overlay hint */}
                {ad.link_url && (
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-lg text-white text-sm font-semibold border border-white/20 scale-90 group-hover:scale-100 transition-transform duration-300">
                            Learn More →
                        </span>
                    </div>
                )}
            </AdWrapper>
        </motion.div>
    );
}
