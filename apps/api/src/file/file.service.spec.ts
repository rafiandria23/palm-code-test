import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MultipartFile } from '@fastify/multipart';
import { mockClient } from 'aws-sdk-client-mock';
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { faker } from '@faker-js/faker';

import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  const mockedS3Client = mockClient(S3Client);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();

    mockedS3Client.reset();
  });

  describe('upload', () => {
    it('should return upload', async () => {
      mockedS3Client.on(CreateMultipartUploadCommand).resolves({
        UploadId: faker.string.uuid(),
      });
      mockedS3Client.on(UploadPartCommand).resolves({
        ETag: faker.string.alphanumeric(),
      });

      const result = await service
        .upload({
          filename: `${faker.system.fileName()}.${faker.system.fileExt()}`,
          mimetype: faker.system.mimeType(),
          encoding: faker.string.alpha(),
          file: faker.string.alphanumeric() as unknown,
        } as MultipartFile)
        .done();

      expect(mockedS3Client.send.callCount).toEqual(1);

      expect(result).toHaveProperty('Bucket');
      expect(result).toHaveProperty('Key');
      expect(result).toHaveProperty('Location');
    });
  });

  describe('get', () => {
    it('should return null when file does not exist', async () => {
      mockedS3Client.on(GetObjectCommand).rejects({ name: 'NoSuchKey' });

      const result = await service.get(
        `${faker.string.uuid()}.${faker.system.fileExt()}`,
      );

      expect(mockedS3Client.send.callCount).toEqual(1);

      expect(result).toBeNull();
    });

    it('should throw error', async () => {
      mockedS3Client
        .on(GetObjectCommand)
        .rejects(new Error(faker.string.alpha()));

      let err: Error;

      try {
        await service.get(`${faker.string.uuid()}.${faker.system.fileExt()}`);
      } catch (error) {
        err = error;
      }

      expect(mockedS3Client.send.callCount).toEqual(1);

      expect(err).toBeInstanceOf(Error);
    });

    it('should return file', async () => {
      const expectedResult = {
        ContentType: faker.system.mimeType(),
      };

      mockedS3Client.on(GetObjectCommand).resolves(expectedResult);

      const result = await service.get(
        `${faker.string.uuid()}.${faker.system.fileExt()}`,
      );

      expect(mockedS3Client.send.callCount).toEqual(1);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUrl', () => {
    it('should return file URL', () => {
      const result = service.getUrl(
        `${faker.string.uuid()}.${faker.system.fileExt()}`,
      );

      expect(result).not.toEqual('');
    });
  });

  describe('delete', () => {
    it('should return void as success', async () => {
      mockedS3Client.on(DeleteObjectCommand).resolves({
        $metadata: {
          httpStatusCode: HttpStatus.OK,
        },
      });

      await service.delete(
        `${faker.string.uuid()}.${faker.system.fileExt()}`,
      );

      expect(mockedS3Client.send.callCount).toEqual(1);
      expect(
        (await mockedS3Client.send.returnValues[0]).$metadata.httpStatusCode,
      ).toEqual(HttpStatus.OK);
    });
  });
});
