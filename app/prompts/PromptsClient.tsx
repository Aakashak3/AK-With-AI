'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import PromptCard from '@/components/PromptCard';
import AdBanner from '@/components/AdBanner';
import { supabase } from '@/lib/supabase';

interface Category {
    id: string;
    name: string;
}

interface Prompt {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    image_url?: string | null;
    created_at: string;
}

export default function PromptsClient() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: categoriesData } = await supabase
                .from('prompt_categories')
                .select('*')
                .order('name');

            if (categoriesData) {
                setCategories(categoriesData);
            }

            const { data: promptsData } = await supabase
                .from('prompts')
                .select(`
          *,
          category:prompt_categories(name)
        `)
                .order('created_at', { ascending: false });

            if (promptsData) {
                const formattedPrompts = promptsData.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    description: p.description || '',
                    content: p.content,
                    category: p.category ? p.category.name : 'Uncategorized',
                    image_url: p.image_url,
                    created_at: p.created_at,
                }));
                setPrompts(formattedPrompts);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const channel = supabase
            .channel('prompts-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'prompts' },
                (payload) => {
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const filteredPrompts = useMemo(() => {
        return prompts.filter((prompt) => {
            const matchesCategory =
                selectedCategory === 'All' || prompt.category === selectedCategory;
            const matchesSearch =
                prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [prompts, selectedCategory, searchQuery]);

    return (
        <>
            <section className="min-h-[40vh] bg-gradient-to-b from-background via-background to-background px-4 py-20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            AI Prompts Library
                        </h1>
                        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                            Professional prompts for image generation, video scripts, and coding tasks. Copy
                            and customize for your projects.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-2xl mx-auto mb-8"
                    >
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search prompts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground/40">
                                🔍
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="bg-gradient-to-b from-background to-background px-4 py-16">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="text-center py-12 text-foreground/60 max-w-7xl mx-auto">
                            Loading prompts...
                        </div>
                    ) : filteredPrompts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                            {filteredPrompts.map((prompt, index) => (
                                <PromptCard key={prompt.id} prompt={prompt} delay={index * 0.05} />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <p className="text-foreground/50 text-lg">
                                No prompts found for "{searchQuery}" in {selectedCategory} category.
                            </p>
                        </motion.div>
                    )}

                    <AdBanner location="prompts_bottom" className="mt-20 mb-12" />
                </div>
            </section>
        </>
    );
}
