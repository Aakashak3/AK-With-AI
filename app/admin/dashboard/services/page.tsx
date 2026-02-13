'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import MediaUpload from '@/components/admin/MediaUpload';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number | null;
  image_url: string | null;
  created_at: string;
  user_id: string;
}

export default function ServicesPanel() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      if (!user) return;

      const { data, error } = await (supabase.from('services') as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user) {
        alert('You must be logged in to manage services.');
        return;
      }

      const dataToSubmit = {
        name: formData.name,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : null,
        image_url: formData.image_url || null,
        user_id: user.id,
      };

      if (editingId) {
        const { error: updateError } = await (supabase.from('services') as any)
          .update(dataToSubmit)
          .eq('id', editingId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await (supabase.from('services') as any)
          .insert([dataToSubmit]);

        if (insertError) throw insertError;
      }

      await fetchServices();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving service:', err);
      alert('Error saving service');
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price ? service.price.toString() : '',
      image_url: service.image_url || '',
    });
    setEditingId(service.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await (supabase.from('services') as any).delete().eq('id', id);

      if (error) throw error;
      await fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Error deleting service');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL services? This cannot be undone.')) return;

    try {
      const { error } = await (supabase.from('services') as any).delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;
      await fetchServices();
      alert('All services cleared.');
    } catch (err) {
      console.error('Error clearing services:', err);
      alert('Error clearing services');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', image_url: '' });
  };

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Services Management</h1>
            <p className="text-foreground/60 mt-1">Manage your professional services</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleDeleteAll}
              className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg font-semibold hover:bg-red-500/20 transition-all duration-300"
            >
              🗑️ Clear All
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-gradient-to-r from-primary to-accent rounded-lg font-semibold text-white hover:shadow-neon transition-all duration-300"
            >
              + Add Service
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-foreground/40 focus:border-primary/50 outline-none transition-colors"
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 text-center">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-foreground/60">
                    Loading...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-foreground/60">
                    No services found. Create one to get started!
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative mx-auto bg-black/20">
                        {service.image_url ? (
                          service.image_url.match(/\.(mp4|webm|ogg)$/i) || service.image_url.includes('video') ? (
                            <video
                              src={service.image_url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={service.image_url}
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">⚡</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{service.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70 max-w-xs truncate">
                      {service.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {service.price ? `$${service.price.toFixed(2)}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(service.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-white/10 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-foreground/60 hover:text-foreground text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Service Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Web Development"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-foreground/40 focus:border-primary/50 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this service..."
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-foreground/40 focus:border-primary/50 outline-none transition-colors min-h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Price (Optional)</label>
                <div className="flex items-center">
                  <span className="text-foreground/60 mr-2">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-foreground/40 focus:border-primary/50 outline-none transition-colors"
                  />
                </div>
              </div>

              <MediaUpload
                bucket="uploads"
                label="Service Media"
                initialUrl={formData.image_url}
                onUploaded={({ url }) => setFormData({ ...formData, image_url: url || '' })}
              />

              <div className="flex gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-lg font-semibold text-white hover:shadow-neon transition-all duration-300"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
