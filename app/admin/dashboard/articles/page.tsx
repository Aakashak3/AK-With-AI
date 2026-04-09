'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, ExternalLink, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchArticles = async () => {
    try {
      let query = (supabase.from('articles') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await (supabase.from('articles') as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Error deleting article');
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Articles</h1>
          <p className="text-foreground/60 text-sm">Create, edit, and publish your blog posts</p>
        </div>
        <Link
          href="/admin/dashboard/articles/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-neon hover:shadow-neon-lg transition-all"
        >
          <Plus size={20} />
          Write Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40" size={18} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
          <Filter size={18} className="text-foreground/40" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-foreground/40">Loading articles...</div>
        ) : filteredArticles.length > 0 ? (
          <div className="divide-y divide-white/10">
            {filteredArticles.map((article) => (
              <div key={article.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-6 flex-1 w-full">
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
                    {article.image_url ? (
                      <img src={article.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/20 italic text-xs">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white truncate">{article.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        article.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {article.status}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/50 truncate">/{article.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <Link
                    href={`/articles/${article.slug}`}
                    target="_blank"
                    className="p-2 text-foreground/60 hover:text-primary transition-colors hover:bg-white/5 rounded-lg"
                    title="View Publicly"
                  >
                    <ExternalLink size={20} />
                  </Link>
                  <Link
                    href={`/admin/dashboard/articles/${article.id}/edit`}
                    className="p-2 text-foreground/60 hover:text-yellow-400 transition-colors hover:bg-white/5 rounded-lg"
                    title="Edit"
                  >
                    <Edit2 size={20} />
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="p-2 text-foreground/60 hover:text-red-400 transition-colors hover:bg-white/5 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-foreground/40 mb-4">No articles found.</p>
            <Link
              href="/admin/dashboard/articles/new"
              className="text-primary hover:underline"
            >
              Write your first article
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
