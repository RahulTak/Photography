import fs from "fs/promises";
import path from "path";

export interface StorageAdapter {
  upload(fileBuffer: Buffer, filename: string): Promise<string>;
  delete(fileUrl: string): Promise<boolean>;
}

/**
 * LocalStorageAdapter implements StorageAdapter to store files in the local filesystem under public/uploads/
 */
export class LocalStorageAdapter implements StorageAdapter {
  private uploadDir: string;
  private publicPath: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), process.env.UPLOAD_PATH || "public/uploads");
    this.publicPath = "/uploads";
  }

  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    // Ensure the destination uploads directory exists
    await fs.mkdir(this.uploadDir, { recursive: true });
    
    const filePath = path.join(this.uploadDir, filename);
    await fs.writeFile(filePath, fileBuffer);
    
    // Return the relative URL path accessible by the browser
    return `${this.publicPath}/${filename}`;
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error(`Failed to delete local file ${fileUrl}:`, error);
      return false;
    }
  }
}

// Instantiate and export the active storage adapter (can be configured via env for S3 / Cloudinary in the future)
export const storageAdapter: StorageAdapter = new LocalStorageAdapter();

/**
 * Generates an optimized, unique WebP filename using the file hash to prevent naming conflicts.
 */
export function getOptimizedFilename(hash: string, originalName?: string): string {
  const base = originalName
    ? path.parse(originalName).name.toLowerCase().replace(/[^a-z0-9-_]/g, "-").substring(0, 30)
    : "asset";
  return `${base}-${hash.substring(0, 12)}.webp`;
}
