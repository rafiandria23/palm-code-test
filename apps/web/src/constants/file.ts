import type { SupportedFileType } from '../interfaces/file';

export const MEGABYTE = Math.pow(1024, 2);

export const SUPPORTED_FILE_TYPE: Record<'image', SupportedFileType[]> = {
  image: [
    {
      mimeType: 'image/png',
      extensions: ['.png'],
    },
    {
      mimeType: 'image/jpeg',
      extensions: ['.jpeg', '.jpg'],
    },
  ],
};
