import _ from 'lodash';
import { registerAs } from '@nestjs/config';

export const awsConfig = registerAs('aws', () => ({
  region: _.defaultTo(process.env.AWS_REGION, 'ap-southeast-1'),
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3BucketName: _.defaultTo(process.env.AWS_S3_BUCKET_NAME, 'palm-code'),
}));
