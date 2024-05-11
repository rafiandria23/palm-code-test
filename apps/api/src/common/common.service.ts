import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
// import {
//   S3Client,
//   UploadPartCommand,
//   PutObjectCommand,
//   DeleteObjectCommand,
// } from '@aws-sdk/client-s3';

@Injectable()
export class CommonService {
  // private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    // this.s3Client = new S3Client({
    //   region: configService.get<string>('aws.region'),
    //   credentials: {
    //     accessKeyId: configService.get<string>('aws.accessKeyId'),
    //     secretAccessKey: configService.get<string>('aws.secretAccessKey'),
    //   },
    // });
    // this.s3Client(new UploadPartCommand({
    //   Body,
    //   ContentLength
    // }))
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
}
