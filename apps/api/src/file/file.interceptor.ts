import _ from 'lodash';
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { extname } from 'path';

import { ApiRequest, ApiResponse } from '../common/common.interface';

import { FileConfigPayload } from './file.interface';
import { FileMetadata } from './file.constant';
import { FileService } from './file.service';

@Injectable()
export class FileInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly fileService: FileService,
  ) {}

  public async intercept(ctx: ExecutionContext, next: CallHandler) {
    const request = ctx.switchToHttp().getRequest<ApiRequest>();
    const response = ctx.switchToHttp().getResponse<ApiResponse>();

    if (!request.isMultipart()) {
      throw new BadRequestException('Request must be multipart!');
    }

    const fileConfig = this.reflector.getAllAndOverride<FileConfigPayload>(
      FileMetadata.Config,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!fileConfig) {
      throw new InternalServerErrorException(
        'File config decorator must be provided!',
      );
    }

    const multipartFile = await request.file();

    if (!multipartFile) {
      throw new BadRequestException('File must not be empty!');
    }

    if (multipartFile.fieldname.trim().toLowerCase() !== fileConfig.field) {
      throw new BadRequestException('File field name is invalid!');
    }

    const fileExtension = extname(multipartFile.filename);

    const foundMimeType = _.find(fileConfig.type, {
      mimeType: multipartFile.mimetype,
    });

    if (
      !_.get(foundMimeType, 'extensions', []).includes(
        fileExtension.toLowerCase(),
      )
    ) {
      throw new BadRequestException('File type is not supported!');
    }

    try {
      const uploadedFile = this.fileService.upload(multipartFile);

      uploadedFile.on('httpUploadProgress', async (progress) => {
        if (progress.loaded > fileConfig.size) {
          await uploadedFile.abort();
        }
      });

      const { Key: fileKey } = await uploadedFile.done();

      _.set(response, 'file.key', fileKey);

      return next.handle();
    } catch (err) {
      if (_.get(err, 'name') === 'AbortError') {
        throw new BadRequestException('File size limit is exceeded!');
      }

      throw err;
    }
  }
}
