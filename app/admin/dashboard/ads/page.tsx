'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import MediaUpload from '@/components/admin/MediaUpload';

interface Ad {
    id: string;
    title: string;
    image_url: string;
    link_url: string;
    location: string;
    is_active: boolean;
    created_at: string;
}

const LOCATIONS = [
    { id: 'youtube_top', label: 'YouTube (Top)' },
    { id: 'youtube_bottom', label: 'YouTube (Bottom)' },
    { id: 'prompts_bottom', label: 'AI Prompts (Bottom)' },
];

export default function AdsPage() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        image_url: '',
        link_url: '',
        location: 'youtube_top',
        is_active: true,
    });

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const { data, error } = await (supabase.from('ads') as any)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAds(data || []);
        } catch (err) {
            console.error('Error fetching ads:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image_url) {
            alert('Please upload an image first');
            return;
        }

        try {
            if (editingId) {
                const { error } = await (supabase.from('ads') as any)
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await (supabase.from('ads') as any)
                    .insert([formData]);
                if (error) throw error;
            }

            handleCloseModal();
            fetchAds();
        } catch (err) {
            console.error('Error saving ad:', err);
            alert('Error saving ad');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this ad?')) return;

        try {
            const { error } = await (supabase.from('ads') as any).delete().eq('id', id);
            if (error) throw error;
            fetchAds();
        } catch (err) {
            console.error('Error deleting ad:', err);
            alert('Error deleting ad');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
            title: '',
            image_url: '',
            link_url: '',
            location: 'youtube_top',
            is_active: true,
        });
    };

    const openEditModal = (ad: Ad) => {
        setEditingId(ad.id);
        setFormData({
            title: ad.title,
            image_url: ad.image_url,
            link_url: ad.link_url,
            location: ad.location,
            is_active: ad.is_active,
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-white">Ads Management</h1>
                    <p className="text-foreground/60 mt-1">Manage advertisements across your site</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-accent rounded-lg font-semibold text-white hover:shadow-neon transition-all duration-300"
                >
                    + Add Ad
                </motion.button>
            </motion.div>

            {/* Ads List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading ? (
                        <div className="col-span-full text-center py-12 text-foreground/60">Loading ads...</div>
                    ) : ads.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-foreground/60 bg-white/5 rounded-xl border border-dashed border-white/10">
                            No ads found. Add your first advertisement!
                        </div>
                    ) : (
                        ads.map((ad, idx) => (
                            <motion.div
                                key={ad.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-white/20 transition-all duration-300"
                            >
                                <div className="relative aspect-video bg-black/20 overflow-hidden">
                                    {ad.image_url.match(/\.(mp4|webm|ogg)$/i) || ad.image_url.includes('video') ? (
                                        <video
                                            src={ad.image_url}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            muted
                                            playsInline
                                        />
                                    ) : (
                                        <Image
                                            src={ad.image_url}
                                            alt={ad.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    )}
                                    {!ad.is_active && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/30 rounded-full text-sm font-bold">
                                                Inactive
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={() => openEditModal(ad)}
                                            className="p-2 bg-black/60 text-white rounded-lg hover:bg-primary transition-colors"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ad.id)}
                                            className="p-2 bg-black/60 text-white rounded-lg hover:bg-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-white truncate">{ad.title}</h3>
                                        <span className="text-xs px-2 py-1 bg-white/10 text-foreground/70 rounded">
                                            {LOCATIONS.find(l => l.id === ad.location)?.label || ad.location}
                                        </span>
                                    </div>
                                    <p className="text-xs text-foreground/60 truncate">{ad.link_url || 'No link'}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-background border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                                <h2 className="text-xl font-bold text-white">
                                    {editingId ? 'Edit Ad' : 'Add New Ad'}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-foreground/60 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Ad Title"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Location</label>
                                        <select
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            {LOCATIONS.map(loc => (
                                                <option key={loc.id} value={loc.id} className="bg-background text-white">
                                                    {loc.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Status</label>
                                        <select
                                            value={formData.is_active ? 'true' : 'false'}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="true" className="bg-background text-white text-green-400">Active</option>
                                            <option value="false" className="bg-background text-white text-red-400">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Link URL</label>
                                    <input
                                        type="url"
                                        value={formData.link_url}
                                        onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div>
                                    <MediaUpload
                                        bucket="uploads"
                                        label="Ad Media"
                                        initialUrl={formData.image_url}
                                        onUploaded={({ url }) => setFormData({ ...formData, image_url: url || '' })}
                                    />
                                </div>

                                <div className="pt-4 flex gap-3 sticky bottom-0 bg-background/80 backdrop-blur-md shrink-0">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-semibold hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-lg text-white font-semibold hover:shadow-neon transition-all"
                                    >
                                        {editingId ? 'Update Ad' : 'Save Ad'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
