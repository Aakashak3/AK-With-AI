'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { uploadFile } from '@/lib/storage';

interface MediaUploadProps {
    bucket: 'posters' | 'thumbnails' | 'services' | 'projects' | 'uploads';
    label?: string;
    initialUrl?: string | null;
    onUploaded: (result: { url: string | null; path: string }) => void;
    accept?: string;
}

export default function MediaUpload({
    bucket,
    label = 'Media',
    initialUrl,
    onUploaded,
    accept = 'image/*,video/*,image/gif'
}: MediaUploadProps) {
    const [preview, setPreview] = useState<string | null>(initialUrl || null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isVideo = (url: string | null) => {
        if (!url) return false;
        return url.match(/\.(mp4|webm|ogg)$/i) || url.includes('video');
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploading(true);
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);

        try {
            const { publicUrl, path } = await uploadFile(bucket, file, { prefix: bucket });
            setPreview(publicUrl);
            onUploaded({ url: publicUrl, path });
        } catch (err) {
            console.error('Media upload failed:', err);
            setError('Upload failed. Try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white mb-1">{label}</label>

            {preview ? (
                <div className="relative w-full aspect-video bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    {isVideo(preview) ? (
                        <video
                            src={preview}
                            controls
                            className="w-full h-full object-contain bg-black"
                        />
                    ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={preview} alt={label} className="w-full h-full object-contain" />
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            setPreview(null);
                            onUploaded({ url: null, path: '' });
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <div className="w-full aspect-video bg-white/5 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-foreground/50 text-sm">
                    No media selected
                </div>
            )}

            <motion.label whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block w-full">
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white cursor-pointer flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                    <span>{uploading ? '⏳ Uploading...' : '📁 Choose File'}</span>
                    <span className="text-xs text-foreground/40 font-normal">(Images, GIFs, Videos)</span>
                </div>
                <input
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
            </motion.label>

            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        </div>
    );
}
