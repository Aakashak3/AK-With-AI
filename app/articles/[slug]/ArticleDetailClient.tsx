'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

interface ArticleDetailClientProps {
  article: any;
}

export default function ArticleDetailClient({ article }: ArticleDetailClientProps) {
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-6 text-sm text-foreground/50 mb-6"
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
              {Math.ceil((article.content?.length || 0) / 1000)} min read
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Success Story
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
          >
            {article.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-foreground/70 leading-relaxed border-l-4 border-primary pl-6"
          >
            {article.description}
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
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </motion.div>
        )}

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none prose-primary"
        >
          <div 
            dangerouslySetInnerHTML={{ __html: article.content }} 
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
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
              AK
            </div>
            <div>
              <p className="text-white font-bold">N. Aakash</p>
              <p className="text-sm text-foreground/50">Full Stack Developer & AI Specialist</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground/50 flex items-center gap-2">
              <Share2 size={16} /> Share:
            </span>
            <div className="flex items-center gap-2">
              <button className="p-3 bg-white/5 hover:bg-[#1877F2]/20 hover:text-[#1877F2] rounded-xl transition-all"><Facebook size={20} /></button>
              <button className="p-3 bg-white/5 hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] rounded-xl transition-all"><Twitter size={20} /></button>
              <button className="p-3 bg-white/5 hover:bg-[#0A66C2]/20 hover:text-[#0A66C2] rounded-xl transition-all"><Linkedin size={20} /></button>
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
