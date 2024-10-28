import { SupportedFileType } from './file.interface';

export enum FileMetadata {
  Config = 'config',
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
