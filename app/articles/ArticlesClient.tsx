'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Search, Calendar, Clock, ChevronRight } from 'lucide-react';

export default function ArticlesClient() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, searchQuery]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header & Search */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-8"
          >
            Latest <span className="text-primary">Articles</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-foreground/40" size={24} />
            <input 
              type="text"
              placeholder="Search articles by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-foreground/30 shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Articles List - One by One */}
        <div className="space-y-12">
          {loading ? (
            <div className="space-y-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex flex-col gap-6">
                  <div className="w-full aspect-video bg-white/5 rounded-3xl" />
                  <div className="h-8 bg-white/5 rounded-full w-3/4" />
                  <div className="h-20 bg-white/5 rounded-2xl w-full" />
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="group relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-neon/20 hover:shadow-2xl"
                >
                  <div className="flex flex-col">
                    {/* Image */}
                    <div className="w-full aspect-[21/9] overflow-hidden relative">
                      {article.image_url ? (
                        <img 
                          src={article.image_url} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-4xl">📝</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 -mt-12 relative bg-background/40 backdrop-blur-md rounded-t-[2.5rem] border-t border-white/10">
                      <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/50 mb-6">
                        <span className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary" />
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock size={16} className="text-accent" />
                          {Math.ceil((article.content?.length || 0) / 1000)} min read
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 group-hover:text-primary transition-colors leading-tight">
                        {article.title}
                      </h2>
                      
                      <p className="text-lg text-foreground/70 mb-10 line-clamp-3 leading-relaxed">
                        {article.description}
                      </p>

                      <Link 
                        href={`/articles/${article.slug}`}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-neon hover:shadow-neon-lg hover:scale-105 active:scale-95 transition-all group/btn"
                      >
                        Don't Miss This
                        <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-foreground/30">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
