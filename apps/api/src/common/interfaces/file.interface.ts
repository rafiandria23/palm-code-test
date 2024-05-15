export interface SupportedFileType {
  mimeType: string;
  extensions: string[];
}

export interface FileConfigPayload {
  field: string;
  type: SupportedFileType[];
  size: number;
}
