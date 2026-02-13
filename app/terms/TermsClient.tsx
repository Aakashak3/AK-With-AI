'use client';

import { motion } from 'framer-motion';

export default function TermsClient() {
    return (
        <div className="min-h-screen bg-background px-4 py-24 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-xl"
            >
                <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
                <div className="space-y-6 text-foreground/70 leading-relaxed">
                    <p>
                        Welcome to AK with AI. By using this website, you agree to the following terms and conditions.
                    </p>
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2">1. Acceptance of Terms</h2>
                        <p>By accessing this site, you acknowledge that you have read and understood these terms.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2">2. Content Usage</h2>
                        <p>The AI prompts and tutorials provided on this site are for educational and professional use. Feel free to customize them for your own projects.</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold text-white mb-2">3. Limitation of Liability</h2>
                        <p>We strive for excellence but cannot guarantee specific outcomes from using the AI prompts or code provided.</p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
