'use client';

import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import { FEATURES, CTA_BUTTONS } from '@/lib/constants';

export default function HomeClient() {
    return (
        <>
            <Hero
                title="Full Stack Developer"
                subtitle="& AI Automation Expert"
                description="AI-powered websites, smart automation solutions, and ready-to-use prompts to scale your business faster."
                buttons={CTA_BUTTONS}
            />

            <section className="min-h-screen bg-gradient-to-b from-background via-background to-background px-4 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {FEATURES.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
