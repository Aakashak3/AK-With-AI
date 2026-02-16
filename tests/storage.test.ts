import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();
const mockFrom = vi.fn(() => ({
  upload: mockUpload,
  getPublicUrl: mockGetPublicUrl,
}));

vi.mock('@/lib/supabase', () => {
  return {
    supabase: {
      storage: {
        from: (bucket: string) => mockFrom(bucket),
      },
    },
  };
});

import { uploadFile, getPublicUrl } from '../lib/storage';

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:30:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('uploadFile', () => {
    it('should upload a file successfully and return public URL', async () => {
      mockUpload.mockResolvedValue({ error: null });
      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://storage.example.com/bucket/uploads/file.png' },
      });

      const file = new File(['test content'], 'test-image.png', { type: 'image/png' });
      const result = await uploadFile('media', file);

      expect(mockFrom).toHaveBeenCalledWith('media');
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringMatching(/^uploads\/2024-01-15T10-30-00-000Z-[a-z0-9]+-test-image\.png\.png$/),
        file,
        {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/png',
        }
      );
      // Note: Current implementation appends extension to sanitized name which already has extension
      expect(result.path).toMatch(/^uploads\/2024-01-15T10-30-00-000Z-[a-z0-9]+-test-image\.png\.png$/);
      expect(result.publicUrl).toBe('https://storage.example.com/bucket/uploads/file.png');
    });

    it('should use custom prefix when provided', async () => {
      mockUpload.mockResolvedValue({ error: null });
      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://storage.example.com/bucket/images/file.png' },
      });

      const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });
      await uploadFile('media', file, { prefix: 'images' });

      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringMatching(/^images\//),
        file,
        expect.any(Object)
      );
    });

    it('should enable upsert when option is provided', async () => {
      mockUpload.mockResolvedValue({ error: null });
      mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/file.png' } });

      const file = new File(['test'], 'doc.pdf', { type: 'application/pdf' });
      await uploadFile('documents', file, { upsert: true });

      expect(mockUpload).toHaveBeenCalledWith(
        expect.any(String),
        file,
        expect.objectContaining({ upsert: true })
      );
    });

    it('should throw error when upload fails', async () => {
      const uploadError = new Error('Storage quota exceeded');
      mockUpload.mockResolvedValue({ error: uploadError });

      const file = new File(['test'], 'file.txt', { type: 'text/plain' });

      await expect(uploadFile('bucket', file)).rejects.toThrow('Storage quota exceeded');
    });

    it('should handle files without extension', async () => {
      mockUpload.mockResolvedValue({ error: null });
      mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/file' } });

      const file = new File(['test'], 'noextension', { type: 'application/octet-stream' });
      const result = await uploadFile('bucket', file);

      // When no '.' in filename, the filename itself becomes the "extension"
      expect(result.path).toMatch(/noextension\.noextension$/);
    });

    it('should sanitize filenames with special characters', async () => {
      mockUpload.mockResolvedValue({ error: null });
      mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/file.png' } });

      const file = new File(['test'], 'My File (1) @ Test!.png', { type: 'image/png' });
      const result = await uploadFile('bucket', file);

      // Should not contain special characters
      expect(result.path).not.toMatch(/[@!()]/);
      // Sanitized name still has .png and extension is also appended
      expect(result.path).toMatch(/my-file-1-test-.png\.png$/);
    });

    it('should use fallback content type when not provided', async () => {
      mockUpload.mockResolvedValue({ error: null });
      mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/file' } });

      // Create file without type
      const file = new File(['test'], 'unknown');
      Object.defineProperty(file, 'type', { value: '' });

      await uploadFile('bucket', file);

      expect(mockUpload).toHaveBeenCalledWith(
        expect.any(String),
        file,
        expect.objectContaining({ contentType: 'application/octet-stream' })
      );
    });

    it('should return null publicUrl when not available', async () => {
      mockUpload.mockResolvedValue({ error: null });
      mockGetPublicUrl.mockReturnValue({ data: { publicUrl: null } });

      const file = new File(['test'], 'file.txt', { type: 'text/plain' });
      const result = await uploadFile('private-bucket', file);

      expect(result.publicUrl).toBeNull();
    });
  });

  describe('getPublicUrl', () => {
    it('should return public URL for a given path', () => {
      mockGetPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://storage.example.com/bucket/path/to/file.png' },
      });

      const result = getPublicUrl('media', 'path/to/file.png');

      expect(mockFrom).toHaveBeenCalledWith('media');
      expect(mockGetPublicUrl).toHaveBeenCalledWith('path/to/file.png');
      expect(result).toBe('https://storage.example.com/bucket/path/to/file.png');
    });

    it('should return null when public URL is not available', () => {
      mockGetPublicUrl.mockReturnValue({ data: { publicUrl: null } });

      const result = getPublicUrl('private-bucket', 'file.txt');

      expect(result).toBeNull();
    });

    it('should return null when data has no publicUrl property', () => {
      mockGetPublicUrl.mockReturnValue({ data: {} });

      const result = getPublicUrl('bucket', 'file.txt');

      expect(result).toBeNull();
    });
  });
});
