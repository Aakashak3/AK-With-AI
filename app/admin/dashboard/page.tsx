'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface DashboardStats {
  prompts: number;
  videos: number;
  projects: number;
  services: number;
  messages: number;
  ads: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    prompts: 0,
    videos: 0,
    projects: 0,
    services: 0,
    messages: 0,
    ads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [promptsRes, videosRes, projectsRes, servicesRes, messagesRes, adsRes] = await Promise.all([
          (supabase.from('prompts') as any).select('id', { count: 'exact' }),
          (supabase.from('videos') as any).select('id', { count: 'exact' }),
          (supabase.from('projects') as any).select('id', { count: 'exact' }),
          (supabase.from('services') as any).select('id', { count: 'exact' }),
          (supabase.from('messages') as any).select('id', { count: 'exact' }),
          (supabase.from('ads') as any).select('id', { count: 'exact' }),
        ]);

        setStats({
          prompts: promptsRes.count || 0,
          videos: videosRes.count || 0,
          projects: projectsRes.count || 0,
          services: servicesRes.count || 0,
          messages: messagesRes.count || 0,
          ads: adsRes.count || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Prompts', value: stats.prompts, icon: '✨', color: 'from-blue-500/20 to-blue-500/5' },
    { label: 'YouTube', value: stats.videos, icon: '🎥', color: 'from-purple-500/20 to-purple-500/5' },
    { label: 'Projects', value: stats.projects, icon: '📁', color: 'from-orange-500/20 to-orange-500/5' },
    { label: 'Services', value: stats.services, icon: '🛠️', color: 'from-green-500/20 to-green-500/5' },
    { label: 'Ads', value: stats.ads, icon: '📢', color: 'from-indigo-500/20 to-indigo-500/5' },
    { label: 'Messages', value: stats.messages, icon: '💬', color: 'from-pink-500/20 to-pink-500/5' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-foreground/60">Welcome to your admin panel</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-br ${card.color} border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{card.icon}</span>
              <span className="text-3xl font-bold text-white">{loading ? '...' : card.value}</span>
            </div>
            <p className="text-foreground/70 font-medium">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/dashboard/prompts"
              className="p-4 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-lg hover:border-blue-500/50 transition-all duration-300 group"
            >
              <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                ✨ Manage Prompts
              </p>
              <p className="text-sm text-foreground/60">Add, edit, or delete AI prompts</p>
            </Link>

            <Link
              href="/admin/dashboard/videos"
              className="p-4 bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-lg hover:border-purple-500/50 transition-all duration-300 group"
            >
              <p className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                🎥 Manage YouTube
              </p>
              <p className="text-sm text-foreground/60">Add or update YouTube videos</p>
            </Link>

            <Link
              href="/admin/dashboard/projects"
              className="p-4 bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 rounded-lg hover:border-orange-500/50 transition-all duration-300 group"
            >
              <p className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                📁 Manage Projects
              </p>
              <p className="text-sm text-foreground/60">Upload and showcase completed projects</p>
            </Link>

            <Link
              href="/admin/dashboard/services"
              className="p-4 bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 rounded-lg hover:border-green-500/50 transition-all duration-300 group"
            >
              <p className="font-semibold text-white group-hover:text-green-400 transition-colors">
                🛠️ Manage Services
              </p>
              <p className="text-sm text-foreground/60">Create and manage your services</p>
            </Link>

            <Link
              href="/admin/dashboard/ads"
              className="p-4 bg-gradient-to-r from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-lg hover:border-indigo-500/50 transition-all duration-300 group"
            >
              <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                📢 Manage Ads
              </p>
              <p className="text-sm text-foreground/60">Upload and position advertisements</p>
            </Link>

            <Link
              href="/admin/dashboard/messages"
              className="p-4 bg-gradient-to-r from-pink-500/10 to-transparent border border-pink-500/20 rounded-lg hover:border-pink-500/50 transition-all duration-300 group"
            >
              <p className="font-semibold text-white group-hover:text-pink-400 transition-colors">
                💬 View Messages
              </p>
              <p className="text-sm text-foreground/60">Check contact form submissions</p>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
