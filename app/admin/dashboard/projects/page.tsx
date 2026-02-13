'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { uploadFile } from '@/lib/storage';
import Image from 'next/image';
import MediaUpload from '@/components/admin/MediaUpload';

interface Project {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    demo_url: string | null;
    tags: string[];
    created_at: string;
    user_id: string;
}

export default function ProjectsPanel() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [isUploading, setIsUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        demo_url: '',
        image_url: '',
        tags: '',
    });

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    const fetchProjects = async () => {
        try {
            if (!user) return;

            const { data, error } = await (supabase.from('projects') as any)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (err) {
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!user) {
                alert('You must be logged in to manage projects.');
                return;
            }

            let uploadedImageUrl = formData.image_url;

            if (imageFile) {
                setIsUploading(true);
                try {
                    const { publicUrl } = await uploadFile('uploads', imageFile, { prefix: 'projects' });
                    if (publicUrl) {
                        uploadedImageUrl = publicUrl;
                    }
                } catch (uploadErr) {
                    console.error('File upload failed:', uploadErr);
                    alert('Failed to upload image, but continuing with project saving...');
                } finally {
                    setIsUploading(false);
                }
            }

            const projectData = {
                title: formData.title,
                description: formData.description,
                demo_url: formData.demo_url,
                image_url: uploadedImageUrl || null,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
                user_id: user.id,
            };

            if (editingId) {
                const { error } = await (supabase.from('projects') as any)
                    .update(projectData)
                    .eq('id', editingId);

                if (error) throw error;
            } else {
                const { error } = await (supabase.from('projects') as any)
                    .insert([projectData]);

                if (error) throw error;
            }

            await fetchProjects();
            handleCloseModal();
        } catch (err) {
            console.error('Error saving project:', err);
            alert('Error saving project');
        }
    };

    const handleEdit = (project: Project) => {
        setFormData({
            title: project.title,
            description: project.description || '',
            demo_url: project.demo_url || '',
            image_url: project.image_url || '',
            tags: project.tags.join(', '),
        });
        setEditingId(project.id);
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const { error } = await (supabase.from('projects') as any).delete().eq('id', id);

            if (error) throw error;
            await fetchProjects();
        } catch (err) {
            console.error('Error deleting project:', err);
            alert('Error deleting project');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ title: '', description: '', demo_url: '', image_url: '', tags: '' });
        setImageFile(null);
    };

    const filteredProjects = projects.filter(
        (p) =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Projects Management</h1>
                        <p className="text-foreground/60 mt-1">Add and manage your completed projects</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-2 bg-gradient-to-r from-primary to-accent rounded-lg font-semibold text-white hover:shadow-neon transition-all duration-300"
                    >
                        + Add Project
                    </motion.button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex gap-4 flex-wrap"
            >
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-xs px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-foreground/40 focus:border-primary/50 outline-none transition-colors"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {loading ? (
                    <div className="col-span-full text-center py-12 text-foreground/60">Loading...</div>
                ) : filteredProjects.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-foreground/60">No projects found.</div>
                ) : (
                    filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="aspect-video relative overflow-hidden bg-black/20">
                                {project.image_url ? (
                                    project.image_url.match(/\.(mp4|webm|ogg)$/i) || project.image_url.includes('video') ? (
                                        <video
                                            src={project.image_url}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            muted
                                            playsInline
                                        />
                                    ) : (
                                        <Image
                                            src={project.image_url}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    )
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">📁</div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                <p className="text-foreground/60 text-sm line-clamp-2 mb-4">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </motion.div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-background border border-white/10 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {editingId ? 'Edit Project' : 'Add New Project'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-foreground/60 hover:text-foreground text-2xl">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary/50 outline-none transition-colors"
                                    required
                                />
                            </div>

                            <MediaUpload
                                bucket="uploads"
                                label="Project Media"
                                initialUrl={formData.image_url}
                                onUploaded={({ url }) => setFormData({ ...formData, image_url: url || '' })}
                            />

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary/50 outline-none transition-colors min-h-[100px]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Demo URL</label>
                                <input
                                    type="url"
                                    value={formData.demo_url}
                                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary/50 outline-none transition-colors"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary/50 outline-none transition-colors"
                                    placeholder="React, Next.js, AI"
                                />
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-lg font-semibold text-white hover:shadow-neon transition-all duration-300 disabled:opacity-50"
                                >
                                    {isUploading ? 'Uploading...' : (editingId ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
