'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';

// 1. Move current logic to inner function
function AuthCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Check for error in URL params
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setStatus('error');
      if (error === 'unauthorized') {
        setMessage('Unauthorized: Only admins can access this area.');
      } else {
        setMessage(errorDescription || error || 'Authentication failed. Please try again.');
      }
      return;
    }

    // Check if user is authenticated and is admin
    if (user && isAdmin) {
      setStatus('success');
      setMessage('Login successful! Redirecting to dashboard...');
      
      // Redirect to dashboard after brief delay
      const timer = setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
      
      return () => clearTimeout(timer);
    }

    // If no user yet, wait a moment
    if (!user) {
      const timer = setTimeout(() => {
        // If still no user after delay, show error
        if (!user) {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }

    // User exists but is not admin
    if (user && !isAdmin) {
      setStatus('error');
      setMessage('Unauthorized: Only admins can access this area.');
    }
  }, [user, isAdmin, searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
          {/* Loading State */}
          {status === 'loading' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6 border-4 border-primary/30 border-t-primary rounded-full"
              />
              <h2 className="text-2xl font-bold text-white mb-2">Authenticating...</h2>
              <p className="text-foreground/60">{message}</p>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-4xl">✓</span>
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
              <p className="text-foreground/60">{message}</p>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-4xl">✕</span>
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
              <p className="text-red-400 mb-6">{message}</p>
              <button
                onClick={() => router.push('/admin')}
                className="px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-lg font-semibold text-white hover:shadow-neon transition-all duration-300"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// 2. Main export with Suspense wrap
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-6 border-4 border-primary/30 border-t-primary rounded-full"
            />
            <h2 className="text-2xl font-bold text-white mb-2">Loading...</h2>
            <p className="text-foreground/60">Preparing authentication...</p>
          </div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
