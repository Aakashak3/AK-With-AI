import { supabase } from '@/lib/supabase';

export interface UploadResult {
  path: string;
  publicUrl: string | null;
}

function generateObjectKey(prefix: string, filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || 'bin';
  const safeName = filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}/${ts}-${rand}-${safeName}.${ext}`.replace(/\.+\./, '.');
}

export async function uploadFile(
  bucket: string,
  file: File,
  options?: { prefix?: string; upsert?: boolean }
): Promise<UploadResult> {
  const prefix = options?.prefix || 'uploads';
  const objectKey = generateObjectKey(prefix, file.name);

  const { error: uploadError } = await supabase.storage.from(bucket).upload(objectKey, file, {
    cacheControl: '3600',
    upsert: !!options?.upsert,
    contentType: file.type || 'application/octet-stream',
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectKey);
  return { path: objectKey, publicUrl: data.publicUrl || null };
}

export function getPublicUrl(bucket: string, path: string): string | null {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl || null;
}
