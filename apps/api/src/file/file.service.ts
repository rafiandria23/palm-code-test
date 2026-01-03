import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MultipartFile } from '@fastify/multipart';
import { Upload } from '@aws-sdk/lib-storage';
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import path from 'node:path';
import * as uuid from 'uuid';

@Injectable()
export class FileService {
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

  public upload(multipartFile: MultipartFile) {
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

  public async get(key: string) {
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

  public getUrl(key: string) {
    return `https://${this.configService.get<string>(
      'aws.s3BucketName',
    )}.s3.amazonaws.com/${key}`;
  }

  public async delete(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get<string>('aws.s3BucketName'),
      Key: key,
    });

    await this.s3Client.send(command);
  }
}
