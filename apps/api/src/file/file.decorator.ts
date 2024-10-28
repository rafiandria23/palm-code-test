import _ from 'lodash';
import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { ApiFile, ApiResponse } from '../common/common.interface';

import { FileConfigPayload } from './file.interface';
import { FileMetadata } from './file.constant';

export const FileConfig = (config: FileConfigPayload) =>
  SetMetadata(FileMetadata.Config, config);

export const uploadedFileFactory = (
  __: unknown,
  ctx: ExecutionContext,
): ApiFile => {
  const response = ctx.switchToHttp().getResponse<ApiResponse>();

  return _.get(response, 'file');
};

export const UploadedFile = createParamDecorator<
  unknown,
  ExecutionContext,
  ApiFile
>(uploadedFileFactory);
