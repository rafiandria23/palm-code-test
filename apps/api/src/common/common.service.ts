import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import path from 'path';
import * as uuid from 'uuid';

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

  public successTimestamp({
    success = true,
    metadata = undefined,
    data = undefined,
  } = {}) {
    return {
      success,
      timestamp: dayjs(),
      metadata,
      data,
    };
  }

  public uploadFile(originalFilename: string, body: Readable) {
    const key = `${uuid.v4()}${path.extname(originalFilename)}`;

    const uploadedFile = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.configService.get<string>('aws.s3BucketName'),
        Key: key,
        Metadata: {
          original_filename: originalFilename,
        },
        Body: body,
      },
    });

    return uploadedFile;
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
