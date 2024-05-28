import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MultipartFile } from '@fastify/multipart';
import { Upload } from '@aws-sdk/lib-storage';
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import dayjs from 'dayjs';
import path from 'path';
import * as uuid from 'uuid';

import { SuccessTimestampDto } from './dtos/success-timestamp.dto';

@Injectable()
export class CommonService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: configService.get<string>('aws.accessKeyId'),
        secretAccessKey: configService.get<string>('aws.secretAccessKey'),
      },
    });
  }

  public successTimestamp<MD = undefined, D = undefined>(
    payload?: Partial<SuccessTimestampDto<MD, D>> | undefined,
  ): SuccessTimestampDto<MD, D> {
    return {
      success: _.get(payload, 'success', true),
      timestamp: _.get(payload, 'timestamp', dayjs()),
      metadata: _.get(payload, 'metadata'),
      data: _.get(payload, 'data'),
    };
  }

  public uploadFile(multipartFile: MultipartFile) {
    const key = `${uuid.v4()}${path.extname(
      multipartFile.filename,
    )}`.toLocaleLowerCase();

    const uploadedFile = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.configService.get<string>('aws.s3BucketName'),
        Key: key,
        ContentType: multipartFile.mimetype,
        ContentEncoding: multipartFile.encoding,
        Metadata: {
          original_filename: multipartFile.filename,
        },
        Body: multipartFile.file,
      },
    });

    return uploadedFile;
  }

  public async getFile(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.configService.get<string>('aws.s3BucketName'),
      Key: key,
    });

    try {
      return await this.s3Client.send(command);
    } catch (err) {
      if (err.name === 'NoSuchKey') {
        return null;
      }

      throw err;
    }
  }

  public getFileUrl(key: string) {
    return `https://${this.configService.get<string>(
      'aws.s3BucketName',
    )}.s3.amazonaws.com/${key}`;
  }

  public async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get<string>('aws.s3BucketName'),
      Key: key,
    });

    await this.s3Client.send(command);
  }
}
