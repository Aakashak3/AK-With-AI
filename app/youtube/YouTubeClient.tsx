'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoCard from '@/components/VideoCard';
import AdBanner from '@/components/AdBanner';
import { supabase } from '@/lib/supabase';

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    duration: string;
}

export default function YouTubeClient() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const { data } = await supabase
                    .from('videos')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .returns<any[]>();

                if (data) {
                    const formattedVideos = data.map((v) => ({
                        id: v.id,
                        title: v.title,
                        description: v.description || '',
                        thumbnailUrl: v.thumbnail_url || '',
                        videoUrl: v.youtube_url,
                        duration: '10:00', // Mock duration or remove badge
                    }));
                    setVideos(formattedVideos);
                }
            } catch (error) {
                console.error('Error fetching videos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <>
            <section className="min-h-[40vh] bg-gradient-to-b from-background via-background to-background px-4 py-20">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="inline-block mb-6 text-5xl">📺</div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                            YouTube Channel
                        </h1>
                        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                            Fun and easy AI tutorials, tools, and challenges 🤖<br />Beginner-friendly content to learn AI step by step 🚀
                        </p>
                    </motion.div>
                    <AdBanner location="youtube_top" className="mt-12 max-w-4xl mx-auto" />
                </div>
            </section>

            <section className="bg-gradient-to-b from-background to-background px-4 py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {loading ? (
                            <div className="col-span-full text-center py-12 text-foreground/60">
                                Loading videos...
                            </div>
                        ) : (
                            videos.map((video, index) => (
                                <VideoCard key={video.id} video={video} delay={index * 0.05} />
                            ))
                        )}
                    </div>
                    <AdBanner location="youtube_bottom" className="mb-16" />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <div className="text-5xl mb-6">🎥</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Subscribe for More Content
                        </h2>
                        <p className="text-foreground/70 mb-8">
                            Get notified about new tutorials, tips, and tech insights
                        </p>
                        <motion.a
                            href="https://www.youtube.com/@Ak_With_AI"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg shadow-neon hover:shadow-neon-lg transition-all duration-300"
                        >
                            📺 Subscribe on YouTube
                        </motion.a>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
