import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler";
import { fileValidator } from "@/validators";
import { compressImageToWebp } from "@/utils/image-compress";
import { storageAdapter, getOptimizedFilename } from "@/utils/image-upload";

export const POST = withErrorHandler(async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file");

  // Validate uploaded file schema and size constraints using Zod
  fileValidator.parse({ file });

  const fileData = file as File;
  const arrayBuffer = await fileData.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Compress image, strip EXIF metadata, and transform it to WebP format using Sharp
  const { buffer: compressedBuffer, hash } = await compressImageToWebp(buffer);

  // Generate optimized unique filename including the hash prefix
  const filename = getOptimizedFilename(hash, fileData.name);

  // Upload file using the active storage adapter (Local Storage /public/uploads)
  const fileUrl = await storageAdapter.upload(compressedBuffer, filename);

  return NextResponse.json({
    success: true,
    message: "Image uploaded, compressed, and converted to WebP successfully.",
    data: {
      url: fileUrl,
      filename,
      hash,
    },
  });
});
