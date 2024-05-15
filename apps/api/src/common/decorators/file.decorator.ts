import { SetMetadata } from '@nestjs/common';

import { FileConfigPayload } from '../interfaces/file.interface';
import { FileMetadata } from '../constants/file.constant';

export const FileConfig = (config: FileConfigPayload) =>
  SetMetadata(FileMetadata.CONFIG, config);
