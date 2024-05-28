import _ from 'lodash';
import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { ApiFile, ApiResponse } from '../interfaces/api.interface';
import { FileConfigPayload } from '../interfaces/file.interface';
import { FileMetadata } from '../constants/file.constant';

export const FileConfig = (config: FileConfigPayload) =>
  SetMetadata(FileMetadata.CONFIG, config);

export const UploadedFile = createParamDecorator<
  unknown,
  ExecutionContext,
  ApiFile
>((__, ctx) => {
  const response = ctx.switchToHttp().getResponse<ApiResponse>();

  return _.get(response, 'file');
});
