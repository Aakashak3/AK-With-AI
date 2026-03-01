'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react'; // Added Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

// 1. Intha logic-ah 'AdminLoginContent' nu thani component-ah mathitom
function AdminLoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, error: authError, user, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const urlError = searchParams.get('error');
  const error = authError || (urlError === 'unauthorized' ? 'Unauthorized: Only admins can access this area' : urlError ? 'Authentication failed. Please try again.' : null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && isAdmin) {
        router.push('/admin/dashboard');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    try {
      await login(email, password);
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center gap-2 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-neon">
                <span className="text-white font-bold text-xl">AK</span>
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                with AI
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-foreground/60">Sign in to manage your content</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loginWithGoogle()}
            disabled={isLoading}
            className="w-full mb-6 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3"
          >
            {/* SVG icon remains same... */}
            Sign in with Google
          </motion.button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black/50 text-foreground/50">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:shadow-neon transition-all duration-300"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:shadow-neon transition-all duration-300"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-lg font-semibold text-white hover:shadow-neon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-foreground/60 mt-6">
            Back to <Link href="/" className="text-primary hover:underline">Home</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// 2. Main export-la Suspense Boundary wrap pannitom
export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Admin Portal...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}