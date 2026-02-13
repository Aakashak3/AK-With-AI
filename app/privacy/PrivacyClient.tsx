'use client';

import { motion } from 'framer-motion';

export default function PrivacyClient() {
    return (
        <div className="min-h-screen bg-background px-4 py-24 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-xl"
            >
                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                <div className="space-y-6 text-foreground/70 leading-relaxed">
                    <p>
                        At AK with AI, we take your privacy seriously. This policy outlines how we collect, use, and protect your information.
                    </p>
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2">1. Data Collection</h2>
                        <p>We only collect information that you voluntarily provide through our contact form, such as your name and email address.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2">2. Use of Information</h2>
                        <p>Your data is used solely to respond to your inquiries and provide the services you request. We do not sell or share your information with third parties.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2">3. Security</h2>
                        <p>We implement modern security measures (using Supabase Auth and RLS) to protect your personal information.</p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
