'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Globe, MessageCircle, Mail } from 'lucide-react';
import Link from 'next/link';

interface ArticleDetailClientProps {
  article: any;
}

export default function ArticleDetailClient({ article }: ArticleDetailClientProps) {
  const [lang, setLang] = useState<'en' | 'ta'>('en');

  // Helper to get content based on language
  const getContent = () => {
    if (lang === 'ta' && article.title_ta) {
      return {
        title: article.title_ta,
        description: article.description_ta,
        content: article.content_ta
      };
    }
    return {
      title: article.title,
      description: article.description,
      content: article.content
    };
  };

  const current = getContent();
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/articles"
            className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors text-sm font-medium group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>
        </motion.div>

        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-6 text-sm text-foreground/50"
            >
              <span className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                {new Date(article.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-accent" />
                {Math.ceil((current.content?.length || 0) / 1000)} min read
              </span>
            </motion.div>

            {/* Language Toggle */}
            {article.title_ta && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex p-1 bg-white/5 border border-white/10 rounded-xl"
              >
                <button
                  onClick={() => setLang('en')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    lang === 'en' ? 'bg-primary text-white shadow-neon' : 'text-foreground/40 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang('ta')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    lang === 'ta' ? 'bg-primary text-white shadow-neon' : 'text-foreground/40 hover:text-white'
                  }`}
                >
                  Tanglish
                </button>
              </motion.div>
            )}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            key={`title-${lang}`}
            className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
          >
            {current.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            key={`desc-${lang}`}
            className="text-xl text-foreground/70 leading-relaxed border-l-4 border-primary pl-6"
          >
            {current.description}
          </motion.p>
        </header>

        {/* Featured Image */}
        {article.image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-16 border border-white/10 shadow-2xl"
          >
            <img 
              src={article.image_url} 
              alt={current.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          key={`content-${lang}`}
          className="prose prose-invert prose-lg max-w-none prose-primary"
        >
          <div 
            dangerouslySetInnerHTML={{ __html: current.content }} 
            className="article-content"
          />
        </motion.div>

        {/* Footer / Share */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-neon/30 shadow-lg">
              AK
            </div>
            <div>
              <p className="text-white font-bold">Aakash</p>
              <p className="text-sm text-foreground/50">Full Stack Developer & AI Specialist</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground/50 flex items-center gap-2">
              <Share2 size={16} /> Share:
            </span>
            <div className="flex items-center gap-2">
              <button className="p-3 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl transition-all" title="Share link"><Globe size={20} /></button>
              <button className="p-3 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl transition-all" title="Share on social"><MessageCircle size={20} /></button>
              <button className="p-3 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl transition-all" title="Email article"><Mail size={20} /></button>
            </div>
          </div>
        </motion.footer>
      </div>

      <style jsx global>{`
        .article-content h1, .article-content h2, .article-content h3 {
          color: white;
          font-weight: bold;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
        }
        .article-content h2 { font-size: 2rem; }
        .article-content p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        .article-content ul, .article-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
          color: rgba(255, 255, 255, 0.7);
        }
        .article-content li { margin-bottom: 0.5rem; }
        .article-content img {
          border-radius: 1.5rem;
          margin: 2.5rem 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .article-content a {
          color: #8B5CF6;
          text-decoration: underline;
        }
        .article-content blockquote {
          border-left: 4px solid #8B5CF6;
          padding-left: 1.5rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.9);
          margin: 2.5rem 0;
        }
      `}</style>
    </div>
  );
}
