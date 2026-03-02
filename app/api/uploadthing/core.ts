import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { env } from '@/lib/env';

const f = createUploadthing();

export const uploadRouter = {
  clinicDocumentUploader: f({
    image: { maxFileSize: '8MB', maxFileCount: 3 },
    pdf: { maxFileSize: '16MB', maxFileCount: 2 },
  })
    .middleware(async () => {
      if (!env.UPLOADTHING_SECRET) {
        throw new UploadThingError('Upload service is not configured.');
      }

      return { source: 'hylono-main' };
    })
    .onUploadComplete(({ metadata, file }) => {
      return {
        source: metadata.source,
        fileKey: file.key,
        fileUrl: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;