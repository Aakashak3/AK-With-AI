'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';

export default function AboutClient() {
    const technologies = [
        { name: 'React', category: 'Frontend' },
        { name: 'Next.js', category: 'Frontend' },
        { name: 'TypeScript', category: 'Language' },
        { name: 'Node.js', category: 'Backend' },
        { name: 'Supabase', category: 'Database' },
        { name: 'Tailwind CSS', category: 'Styling' },
        { name: 'Claude AI', category: 'AI' },
        { name: 'Midjourney', category: 'AI' },
        { name: 'PostgreSQL', category: 'Database' },
        { name: 'Python', category: 'Language' },
        { name: 'Docker', category: 'DevOps' },
        { name: 'ChatGPT API', category: 'AI' },
    ];

    const experiences = [
        {
            year: '2024-Present',
            title: 'AI Automation Specialist',
            description: 'Integrating AI solutions for businesses, specializing in ChatGPT and Claude implementations',
            icon: '🤖',
        },
        {
            year: '2022-2024',
            title: 'Full Stack Developer',
            description: 'Building scalable web applications with React, Next.js, and modern backend technologies',
            icon: '💻',
        },
        {
            year: '2021-2022',
            title: 'Frontend Developer',
            description: 'Creating responsive, user-friendly interfaces with React and modern CSS frameworks',
            icon: '🎨',
        },
        {
            year: '2019-2020',
            title: 'Started Web Development',
            description: 'Learned HTML, CSS, JavaScript and built my first web applications',
            icon: '🚀',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                duration: 0.8,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 },
        },
    };

    return (
        <div className="bg-background">
            {/* Profile Section */}
            <section className="min-h-[60vh] flex flex-col items-center justify-center px-4 pt-32 pb-20 bg-gradient-to-b from-background via-background to-background relative overflow-hidden">
                {/* Animated background blobs */}
                <motion.div
                    className="absolute top-10 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
                    animate={{ y: [0, -30, 0], x: [0, 30, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-10 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
                    animate={{ y: [0, 30, 0], x: [0, -30, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 mb-8"
                >
                    <div className="w-32 h-32 rounded-full border-2 border-primary/50 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-lg shadow-neon">
                        <span className="text-6xl">👤</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center relative z-10 max-w-3xl"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        <span className="text-white">About </span>
                        <span className="text-primary">Me</span>
                    </h1>
                    <p className="text-lg text-foreground/70">
                        Passionate developer transforming ideas into innovative digital solutions
                    </p>
                </motion.div>

                {/* Bio Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative z-10 mt-12 max-w-2xl"
                >
                    <GlassCard>
                        <p className="text-foreground text-center leading-relaxed">
                            I’m <span className="text-primary font-semibold">N. Aakash</span>, a Full Stack Developer and AI Automation Expert, building modern and scalable web applications using AI and the latest technologies.
                        </p>
                    </GlassCard>
                </motion.div>
            </section>

            {/* Tech Stack Section */}
            <section className="px-4 py-20 bg-gradient-to-b from-background to-background">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Tech </span>
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Stack</span>
                        </h2>
                        <p className="text-foreground/60">Technologies and tools I work with</p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        {technologies.map((tech, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="px-6 py-3 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-full hover:border-primary/60 transition-all duration-300 hover:shadow-neon cursor-default"
                            >
                                <span className="text-foreground font-medium">{tech.name}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Experience Timeline Section */}
            <section className="px-4 py-20 bg-gradient-to-b from-background to-background relative">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-2">
                            <span className="text-white">Experience </span>
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Timeline</span>
                        </h2>
                        <p className="text-foreground/60">My journey in software development</p>
                    </motion.div>

                    <div className="max-w-2xl mx-auto">
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/50 via-accent/50 to-transparent" />

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-12 relative"
                        >
                            {experiences.map((exp, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className={`flex gap-4 md:gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    <div className="hidden md:flex flex-col items-center">
                                        <motion.div
                                            whileHover={{ scale: 1.3 }}
                                            className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-neon"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <GlassCard delay={index * 0.1}>
                                            <div className="flex items-start gap-4">
                                                <span className="text-4xl">{exp.icon}</span>
                                                <div className="flex-1">
                                                    <div className="text-sm text-primary font-semibold mb-2">{exp.year}</div>
                                                    <h3 className="text-xl font-bold text-white mb-2">{exp.title}</h3>
                                                    <p className="text-foreground/70">{exp.description}</p>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section className="px-4 py-20 bg-gradient-to-b from-background to-background">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-8"
                    >
                        <motion.div variants={itemVariants}>
                            <GlassCard>
                                <div className="flex items-start gap-4">
                                    <div className="text-5xl">🎯</div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-3">Vision</h3>
                                        <p className="text-foreground/70 leading-relaxed">
                                            To empower businesses and individuals with innovative AI-driven solutions that simplify complex workflows and unlock new possibilities in the digital world.
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <GlassCard>
                                <div className="flex items-start gap-4">
                                    <div className="text-5xl">🛡️</div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-3">Mission</h3>
                                        <p className="text-foreground/70 leading-relaxed">
                                            To deliver high-quality, scalable web applications while staying at the forefront of AI technology, helping clients achieve their goals through cutting-edge solutions.
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
