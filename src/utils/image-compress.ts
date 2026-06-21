import sharp from "sharp";
import crypto from "crypto";

export interface CompressionResult {
  buffer: Buffer;
  hash: string;
  width?: number;
  height?: number;
}

/**
 * Compresses an input image buffer, auto-orients it, resizes it if it exceeds maxWidth,
 * strips EXIF metadata, and converts it to WebP with a set quality.
 * Returns the optimized buffer, its SHA-256 hash, and dimensions.
 */
export async function compressImageToWebp(
  inputBuffer: Buffer,
  maxWidth = 1920,
  quality = 85
): Promise<CompressionResult> {
  // Generate SHA-256 hash of the original input buffer to prevent duplicate uploads
  const hash = crypto.createHash("sha256").update(inputBuffer).digest("hex");

  let image = sharp(inputBuffer);
  const metadata = await image.metadata();

  // Auto-orient the image based on EXIF orientation headers
  image = image.rotate();

  // Resize if width is larger than maxWidth, preserving aspect ratio
  if (metadata.width && metadata.width > maxWidth) {
    image = image.resize({
      width: maxWidth,
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  // Convert to WebP format, optimize quality (85-90), and strip EXIF (default behavior in sharp)
  const compressedBuffer = await image
    .webp({ quality, effort: 4 })
    .toBuffer();

  const finalMetadata = await sharp(compressedBuffer).metadata();

  return {
    buffer: compressedBuffer,
    hash,
    width: finalMetadata.width,
    height: finalMetadata.height,
  };
}
