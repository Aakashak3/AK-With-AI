'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  user_id: string | null;
}

export default function MessagesPanel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'unread'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);

      if (error) throw error;
      await fetchMessages();
      setSelectedMessage(null);
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Error deleting message');
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Messages Inbox</h1>
            <p className="text-foreground/60 mt-1">View contact form submissions</p>
          </div>
          <div className="text-3xl font-bold text-primary">
            {loading ? '...' : filteredMessages.length}
          </div>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 flex-wrap"
      >
        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-xs px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-foreground/40 focus:border-primary/50 outline-none transition-colors"
        />
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as 'all' | 'unread')}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-primary/50 outline-none transition-colors"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread</option>
        </select>
      </motion.div>

      {/* Messages List & Detail View */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]"
      >
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Messages</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-foreground/60">Loading...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-6 text-center text-foreground/60">
                No messages found.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`w-full p-4 border-b border-white/5 hover:bg-white/5 transition-colors text-left ${selectedMessage?.id === msg.id ? 'bg-white/10' : ''
                    }`}
                >
                  <p className="font-semibold text-white text-sm mb-1">{msg.name}</p>
                  <p className="text-xs text-foreground/60 mb-2">{msg.email}</p>
                  <p className="text-xs text-foreground/50 line-clamp-2">{msg.message}</p>
                  <p className="text-xs text-foreground/40 mt-2">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedMessage.name}</h3>
                  <p className="text-sm text-foreground/60 mt-1">{selectedMessage.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <p className="text-xs text-foreground/50 mb-4">
                  Received: {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-white/10">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium inline-block"
                >
                  Reply via Email
                </a>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-foreground/60">Select a message to view details</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-xl p-6">
          <p className="text-blue-300 font-medium mb-2">Total Messages</p>
          <p className="text-3xl font-bold text-white">{messages.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 rounded-xl p-6">
          <p className="text-green-300 font-medium mb-2">This Month</p>
          <p className="text-3xl font-bold text-white">
            {
              messages.filter((m) => {
                const messageDate = new Date(m.created_at);
                const today = new Date();
                return (
                  messageDate.getMonth() === today.getMonth() &&
                  messageDate.getFullYear() === today.getFullYear()
                );
              }).length
            }
          </p>
        </div>
      </motion.div>
    </div>
  );
}
