'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { id: 'prompts', label: 'Prompts', href: '/admin/dashboard/prompts', icon: '✨' },
  { id: 'videos', label: 'YouTube', href: '/admin/dashboard/videos', icon: '🎥' },
  { id: 'services', label: 'Services', href: '/admin/dashboard/services', icon: '🛠️' },
  { id: 'projects', label: 'Projects', href: '/admin/dashboard/projects', icon: '📁' },
  { id: 'ads', label: 'Ads', href: '/admin/dashboard/ads', icon: '📢' },
  { id: 'messages', label: 'Messages', href: '/admin/dashboard/messages', icon: '💬' },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-neon"
      >
        <span>☰</span>
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: typeof window !== 'undefined' && window.innerWidth < 768 ? (isMobileOpen ? 0 : -300) : 0,
          width: isCollapsed ? 80 : 256
        }}
        className={`bg-white/5 backdrop-blur-xl border-r border-white/10 h-screen flex flex-col fixed left-0 top-0 z-50 md:z-40 transition-all duration-300`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-sm">AK</span>
              </div>
              <span className="font-bold text-white">Admin</span>
            </div>
          )}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                setIsMobileOpen(false);
              } else {
                setIsCollapsed(!isCollapsed);
              }
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {typeof window !== 'undefined' && window.innerWidth < 768 ? '✕' : (isCollapsed ? '→' : '←')}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.href)
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
                }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="text-xl">{item.icon}</span>
              {(!isCollapsed || isMobileOpen) && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {(!isCollapsed || isMobileOpen) && (
            <div className="text-xs text-foreground/60 p-3 bg-white/5 rounded-lg">
              <p className="font-medium text-foreground mb-1">Logged in as</p>
              <p className="truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            {isCollapsed && !isMobileOpen ? '🚪' : (
              <>
                <span>🚪</span>
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
