'use client';

import { motion } from 'framer-motion';
import ContactForm from '@/components/ContactForm';
import { CONTACT_METHODS } from '@/lib/constants';

export default function ContactClient() {
    return (
        <>
            <section className="min-h-[30vh] bg-gradient-to-b from-background via-background to-background px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-foreground/70">
                            Have a project in mind? Let's discuss how I can help bring your vision to life
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="bg-gradient-to-b from-background to-background px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-16"
                    >
                        {CONTACT_METHODS.map((method, index) => (
                            <motion.a
                                key={method.id}
                                href={method.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors duration-300"
                            >
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg"
                                    style={{ backgroundColor: method.bgColor }}
                                >
                                    {method.icon}
                                </div>
                                <span className="text-sm font-semibold text-white text-center">
                                    {method.label}
                                </span>
                                <span className="text-xs text-foreground/60 text-center">
                                    {method.value}
                                </span>
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="bg-gradient-to-b from-background to-background px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <ContactForm />
                </div>
            </section>

            <section className="bg-gradient-to-b from-background to-background px-4 py-8">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.a
                        href="/admin"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm text-foreground/50 hover:text-primary transition-colors duration-300"
                    >
                        Admin Login →
                    </motion.a>
                </div>
            </section>
        </>
    );
}
