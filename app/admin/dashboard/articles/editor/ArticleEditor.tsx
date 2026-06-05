'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Save, Send, ArrowLeft, Image as ImageIcon, Type, Link as LinkIcon, FileText } from 'lucide-react';
import Link from 'next/link';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-white/5 animate-pulse rounded-lg" />
});
// CSS import moved into component; will be loaded lazily

interface ArticleEditorProps {
  id?: string;
  initialData?: any;
}

export default function ArticleEditor({ id, initialData }: ArticleEditorProps) {
  // Load Quill stylesheet only when this component mounts
  useEffect(() => {
    import('react-quill/dist/quill.snow.css');
  }, []);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    image_url: initialData?.image_url || '',
    status: initialData?.status || 'draft',
    title_ta: initialData?.title_ta || '',
    description_ta: initialData?.description_ta || '',
    content_ta: initialData?.content_ta || '',
  });
  const [uploading, setUploading] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, formData.slug]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `article-thumbnails/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('articles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('articles')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setLoading(true);
    try {
      const dataToSave = { ...formData, status };
      
      let error;
      if (id) {
        const { error: updateError } = await (supabase.from('articles') as any)
          .update(dataToSave)
          .eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await (supabase.from('articles') as any)
          .insert([dataToSave]);
        error = insertError;
      }

      if (error) throw error;
      
      router.push('/admin/dashboard/articles');
      router.refresh();
      // Force a re-fetch of articles by reloading the page if necessary
      // router.refresh() sometimes isn't enough for client components
      window.location.href = '/admin/dashboard/articles';
    } catch (err) {
      console.error('Error saving article:', err);
      alert('Error saving article. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/dashboard/articles"
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-foreground/60 hover:text-white"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">
            {id ? 'Edit Article' : 'Write New Article'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-neon hover:shadow-neon-lg transition-all disabled:opacity-50"
          >
            <Send size={18} />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/60 flex items-center gap-2">
              <Type size={16} /> Article Title (English)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a catchy title..."
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/60 flex items-center gap-2">
              <FileText size={16} /> Content (English)
            </label>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden min-h-[500px]">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                modules={modules}
                className="quill-dark"
              />
            </div>
          </div>

          {/* Separator */}
          <div className="py-8">
            <div className="h-px bg-white/10 w-full relative">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-background text-primary font-bold text-sm tracking-widest uppercase">
                Tanglish Version
              </span>
            </div>
          </div>

          {/* Tanglish Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/60 flex items-center gap-2">
              <Type size={16} /> Tanglish Title
            </label>
            <input
              type="text"
              value={formData.title_ta}
              onChange={(e) => setFormData(prev => ({ ...prev, title_ta: e.target.value }))}
              placeholder="Enter Tanglish title..."
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Tanglish Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/60 flex items-center gap-2">
              <FileText size={16} /> Content (Tanglish)
            </label>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden min-h-[500px]">
              <ReactQuill
                theme="snow"
                value={formData.content_ta}
                onChange={(content) => setFormData(prev => ({ ...prev, content_ta: content }))}
                modules={modules}
                className="quill-dark"
              />
            </div>
          </div>
        </div>

        {/* Sidebar / Settings */}
        <div className="space-y-6">
          {/* Slug */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/60 flex items-center gap-2">
                <LinkIcon size={16} /> URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <label className="text-sm font-medium text-foreground/60 flex items-center gap-2">
              <ImageIcon size={16} /> Featured Image
            </label>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors overflow-hidden">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-foreground/40">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="text-xs">Uploading...</span>
                    </div>
                  ) : formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-foreground/40">
                      <ImageIcon size={24} />
                      <span className="text-xs font-medium">Click to upload thumbnail</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-medium text-foreground/30 uppercase tracking-wider">
                  Or manual Image URL
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Tanglish Description */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <label className="text-sm font-medium text-foreground/60 flex items-center gap-2">
              <FileText size={16} /> Tanglish Summary
            </label>
            <textarea
              value={formData.description_ta}
              onChange={(e) => setFormData(prev => ({ ...prev, description_ta: e.target.value }))}
              rows={4}
              placeholder="Brief description in Tanglish..."
              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Description / Summary */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <label className="text-sm font-medium text-foreground/60 flex items-center gap-2">
              <FileText size={16} /> Short Summary (English)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Brief description for SEO and cards..."
              className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .quill-dark .ql-toolbar {
          background: rgba(255, 255, 255, 0.05);
          border: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .quill-dark .ql-container {
          border: none !important;
          font-family: inherit;
          font-size: 1rem;
          color: white;
          min-height: 400px;
        }
        .quill-dark .ql-stroke {
          stroke: rgba(255, 255, 255, 0.6) !important;
        }
        .quill-dark .ql-fill {
          fill: rgba(255, 255, 255, 0.6) !important;
        }
        .quill-dark .ql-picker {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .quill-dark .ql-picker-options {
          background: #1a1a1a !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }
        .quill-dark .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.3) !important;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
