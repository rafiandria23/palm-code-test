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

  const s3ClientMock = mockClient(S3Client);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();

    s3ClientMock.reset();
  });

  describe('upload', () => {
    it('should return upload', async () => {
      s3ClientMock.on(CreateMultipartUploadCommand).resolves({
        UploadId: faker.string.uuid(),
      });
      s3ClientMock.on(UploadPartCommand).resolves({
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

      expect(s3ClientMock.send.callCount).toEqual(1);

      expect(result).toHaveProperty('Bucket');
      expect(result).toHaveProperty('Key');
      expect(result).toHaveProperty('Location');
    });
  });

  describe('get', () => {
    it('should return null when file does not exist', async () => {
      s3ClientMock.on(GetObjectCommand).rejects({ name: 'NoSuchKey' });

      const result = await service.get(
        `${faker.string.uuid()}.${faker.system.fileExt()}`,
      );

      expect(s3ClientMock.send.callCount).toEqual(1);

      expect(result).toBeNull();
    });

    it('should throw error', async () => {
      s3ClientMock
        .on(GetObjectCommand)
        .rejects(new Error(faker.string.alpha()));

      let err: Error;

      try {
        await service.get(`${faker.string.uuid()}.${faker.system.fileExt()}`);
      } catch (error) {
        err = error;
      }

      expect(s3ClientMock.send.callCount).toEqual(1);

      expect(err).toBeInstanceOf(Error);
    });

    it('should return file', async () => {
      const expectedResult = {
        ContentType: faker.system.mimeType(),
      };

      s3ClientMock.on(GetObjectCommand).resolves(expectedResult);

      const result = await service.get(
        `${faker.string.uuid()}.${faker.system.fileExt()}`,
      );

      expect(s3ClientMock.send.callCount).toEqual(1);

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
      s3ClientMock.on(DeleteObjectCommand).resolves({
        $metadata: {
          httpStatusCode: HttpStatus.OK,
        },
      });

      await service.delete(`${faker.string.uuid()}.${faker.system.fileExt()}`);

      expect(s3ClientMock.send.callCount).toEqual(1);
      expect(
        (await s3ClientMock.send.returnValues[0]).$metadata.httpStatusCode,
      ).toEqual(HttpStatus.OK);
    });
  });
});
