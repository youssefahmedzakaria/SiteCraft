/**
 * Compresses an image file while maintaining its original format
 * @param file - The original image file
 * @param maxWidth - Maximum width (default: 800)
 * @param maxHeight - Maximum height (default: 800)
 * @param quality - Compression quality 0-1 (default: 0.8)
 * @returns Promise<File> - Compressed image file
 */
export async function compressImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress the image
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to blob with original file type
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create new file with original name and type
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load the image
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Compresses multiple image files
 * @param files - Array of image files
 * @param maxWidth - Maximum width (default: 800)
 * @param maxHeight - Maximum height (default: 800)
 * @param quality - Compression quality 0-1 (default: 0.8)
 * @returns Promise<File[]> - Array of compressed image files
 */
export async function compressImages(
  files: File[],
  maxWidth: number = 400,
  maxHeight: number = 400,
  quality: number = 0.6
): Promise<File[]> {
  const compressedFiles = await Promise.all(
    files.map(file => compressImage(file, maxWidth, maxHeight, quality))
  );
  return compressedFiles;
} 