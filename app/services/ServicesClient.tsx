'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard';
import ProjectCard from '@/components/ProjectCard';
import AdBanner from '@/components/AdBanner';
import { PROJECTS_DATA } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

interface Service {
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
}

export default function ServicesClient() {
    const [services, setServices] = useState<Service[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, projectsRes] = await Promise.all([
                    supabase.from('services').select('*').order('created_at', { ascending: true }).returns<any[]>(),
                    supabase.from('projects').select('*').order('created_at', { ascending: false }).returns<any[]>()
                ]);

                if (servicesRes.data) {
                    const formattedServices = servicesRes.data.map((s) => ({
                        id: s.id,
                        icon: '⚡',
                        title: s.name,
                        description: s.description,
                        image_url: s.image_url,
                        included: s.price ? [`Price: $${s.price}`] : [],
                        cta: {
                            text: 'Get Started',
                            href: '/contact',
                        },
                    }));
                    setServices(formattedServices);
                }

                if (projectsRes.data) {
                    setProjects(projectsRes.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {/* Header Section */}
            <section className="min-h-[30vh] bg-gradient-to-b from-background via-background to-background px-4 py-16">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Services</h1>
                        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                            Transform your ideas into reality with cutting-edge development and AI solutions
                        </p>
                    </motion.div>

                    {/* Advertisement */}
                    <AdBanner location="prompts_bottom" className="mt-12 max-w-4xl mx-auto" />
                </div>
            </section>

            {/* Services Grid */}
            <section className="bg-gradient-to-b from-background to-background px-4 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {loading ? (
                            <div className="col-span-full text-center py-12 text-foreground/60">
                                Loading services...
                            </div>
                        ) : (
                            services.map((service, index) => (
                                <ServiceCard key={service.id} service={service} delay={index * 0.1} />
                            ))
                        )}
                    </div>

                    {/* Projects Showcase Section */}
                    <div className="mb-20">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                <span className="text-white">Completed </span>
                                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Projects</span>
                            </h2>
                            <p className="text-foreground/60 max-w-2xl mx-auto">
                                Check out some of my recent projects and see what I can build for you
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {projects.length > 0 ? (
                                projects.map((project, index) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={{
                                            id: project.id,
                                            title: project.title,
                                            description: project.description || '',
                                            image: project.image_url || 'https://placehold.co/400x300?text=Project',
                                            demoUrl: project.demo_url || '#',
                                            tags: project.tags || [],
                                        }}
                                        delay={index * 0.1}
                                    />
                                ))
                            ) : PROJECTS_DATA.map((project, index) => (
                                <ProjectCard key={project.id} project={project} delay={index * 0.1} />
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 text-center max-w-2xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Start Your Project?
                        </h2>
                        <p className="text-foreground/70 mb-8">
                            Let's discuss how I can help bring your vision to life with modern technology and AI automation
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/contact"
                                    className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-neon hover:shadow-neon-lg transition-all duration-300"
                                >
                                    📞 Get in Touch
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/about"
                                    className="inline-block px-8 py-3 border border-primary/50 text-primary font-semibold rounded-lg hover:shadow-neon transition-all duration-300"
                                >
                                    📖 Learn More About Me
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
