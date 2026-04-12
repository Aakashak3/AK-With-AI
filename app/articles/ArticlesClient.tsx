'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, Clock, ChevronRight } from 'lucide-react';

export default function ArticlesClient() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'tanglish'>('english');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await (supabase.from('articles') as any)
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
    return articles.filter(a => {
      const title = (selectedLanguage === 'tanglish' && a.title_ta) ? a.title_ta : a.title;
      const desc = (selectedLanguage === 'tanglish' && a.description_ta) ? a.description_ta : a.description;
      
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (desc || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [articles, searchQuery, selectedLanguage]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
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
            className="flex flex-col gap-6 max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-foreground/40" size={24} />
              <input 
                type="text"
                placeholder="Search articles by title or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-foreground/30 shadow-2xl"
              />
            </div>

            {/* Language Switcher */}
            <div className="flex justify-center">
              <div className="inline-flex items-center p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <button
                  onClick={() => setSelectedLanguage('english')}
                  className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                    selectedLanguage === 'english' 
                    ? 'bg-primary text-white shadow-neon' 
                    : 'text-foreground/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setSelectedLanguage('tanglish')}
                  className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                    selectedLanguage === 'tanglish' 
                    ? 'bg-primary text-white shadow-neon' 
                    : 'text-foreground/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Tanglish
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse flex flex-col gap-6">
                  <div className="w-full aspect-video bg-white/5 rounded-3xl" />
                  <div className="h-6 bg-white/5 rounded-full w-3/4" />
                  <div className="h-16 bg-white/5 rounded-2xl w-full" />
                </div>
              ))}
            </>
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
                  <div className="flex flex-col h-full">
                    {/* Image */}
                    <div className="w-full aspect-video overflow-hidden relative">
                      {article.image_url ? (
                        <Image 
                          src={article.image_url} 
                          alt={article.title}
                          fill
                          priority={index < 3}
                          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-4xl">📝</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                    </div>
 
                    {/* Content */}
                    <div className="p-6 md:p-8 -mt-8 relative bg-background/40 backdrop-blur-md rounded-t-[2.5rem] border-t border-white/10 flex flex-col flex-1">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/50 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-primary" />
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-accent" />
                          {Math.ceil((article.content?.length || 0) / 1000)} min
                        </span>
                      </div>
 
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                        {(selectedLanguage === 'tanglish' && article.title_ta) ? article.title_ta : article.title}
                      </h2>
                      
                      <p className="text-sm text-foreground/70 mb-8 line-clamp-3 leading-relaxed flex-grow">
                        {(selectedLanguage === 'tanglish' && article.description_ta) ? article.description_ta : article.description}
                      </p>
 
                      <div className="mt-auto">
                        <Link 
                          href={`/articles/${article.slug}`}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/20 font-bold rounded-xl shadow-neon/10 hover:shadow-neon/20 hover:bg-primary hover:text-white transition-all group/btn w-full justify-center"
                        >
                          Read More
                          <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
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
