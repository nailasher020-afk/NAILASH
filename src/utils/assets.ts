/**
 * Normalizes all image paths for reliable rendering across dev, preview, and production.
 * Handles:
 * - Data URLs (base64 uploaded images from user device)
 * - Remote HTTP/HTTPS URLs (Unsplash, Cloudinary, Imgur, direct image links)
 * - Bundled local /assets/... paths
 * - Obsolete /src/assets/ paths converted to /assets/
 */
export const fallbackProductImage = '/assets/hero_fashion_editorial.jpg';

export const normalizeAssetUrl = (url: string | undefined | null): string => {
  if (!url || typeof url !== 'string') {
    return fallbackProductImage;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return fallbackProductImage;
  }

  // 1. Data URLs (uploaded images from file picker)
  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // 2. Blob URLs (in-memory previews)
  if (trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // 3. If it's a full URL to our own host asset, strip the origin
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      if (
        (parsed.hostname.includes('run.app') ||
         parsed.hostname === 'localhost' ||
         parsed.hostname === '127.0.0.1' ||
         parsed.hostname.includes('netlify.app')) &&
        parsed.pathname.startsWith('/assets/')
      ) {
        return parsed.pathname;
      }
    } catch (_) {
      // ignore parse error, return as-is
    }
    return trimmed;
  }

  // 4. Normalize legacy /src/assets/ or /assets/images/ paths
  let clean = trimmed.replace(/^\/?src\/assets\/(images\/)?/, '/assets/');
  clean = clean.replace(/^\/assets\/images\//, '/assets/');

  // 5. Ensure root-relative slash for local assets
  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }

  return clean;
};

/**
 * Compresses an image file (from user's file picker) to a lightweight Data URL.
 * Automatically limits dimensions (max 1200px) and quality (0.82) to prevent
 * localStorage quota issues while maintaining crisp luxury visual quality.
 */
export const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG 0.82 for optimal size & crisp visual quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressedDataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Curated preset assets from Nailash high-fashion collections
 * available for 1-click addition in the product image manager.
 */
export const ATELIER_GALLERY_PRESETS = [
  {
    title: 'Emerald Luxury Lawn',
    url: '/assets/cat_women_collection.jpg',
    category: 'Women Pret'
  },
  {
    title: 'Editorial Haute Couture',
    url: '/assets/hero_fashion_editorial.jpg',
    category: 'Festive'
  },
  {
    title: 'Contemporary Summer Lawn',
    url: '/assets/cat_new_arrivals.jpg',
    category: 'New Arrivals'
  },
  {
    title: 'Raw Silk Formal Suit',
    url: '/assets/banner_promotional_silk.jpg',
    category: 'Silk Formal'
  },
  {
    title: 'Gentlemen Heirloom Kurta',
    url: '/assets/cat_men_collection.jpg',
    category: 'Men Kurta'
  }
];
