import { SupportedFileType } from '../interfaces/file.interface';

export enum FileMetadata {
  CONFIG = 'config',
}

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
