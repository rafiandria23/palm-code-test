import _ from 'lodash';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

import { CommonService } from '../common/common.service';
import { UserService } from '../user/user.service';

import { PasswordLength } from './auth.constant';
import { UserPassword } from './models/user-password.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const userPasswordModelMock = {
    create: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const userServiceMock = {
    create: jest.fn(),
    readByEmail: jest.fn(),
    updateEmail: jest.fn(),
    delete: jest.fn(),
  };

  const bcryptMock = {
    compare: jest.spyOn(bcrypt, 'compare'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(UserPassword),
          useValue: userPasswordModelMock,
        },
        ConfigService,
        CommonService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  const userMock = {
    id: faker.string.uuid(),

    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),

    created_at: faker.date.anytime(),
    updated_at: faker.date.anytime(),
    deleted_at: null,

    restore: jest.fn(),
  };

  const userPasswordMock = {
    id: faker.string.uuid(),

    user_id: userMock.id,
    password: faker.internet.password({
      length: PasswordLength.Min,
    }),

    created_at: faker.date.anytime(),
    updated_at: faker.date.anytime(),
    deleted_at: null,

    update: jest.fn(),
    restore: jest.fn(),
  };

  const authTokenMock = {
    access_token: faker.string.alphanumeric(),
  };

  describe('signUp', () => {
    it('should return 422 when user already exists', async () => {
      userServiceMock.readByEmail.mockResolvedValue(userMock);

      let err: UnprocessableEntityException;

      try {
        await service.signUp({
          ..._.omit(userMock, ['id']),
          ..._.pick(userPasswordMock, ['password']),
        });
      } catch (error) {
        err = error;
      }

      expect(userServiceMock.readByEmail).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return auth token', async () => {
      userServiceMock.readByEmail.mockResolvedValue(null);
      userServiceMock.create.mockResolvedValue(userMock);
      jwtServiceMock.signAsync.mockResolvedValue(authTokenMock.access_token);
      userPasswordModelMock.create.mockResolvedValue(userPasswordMock);

      const { success, data } = await service.signUp({
        ..._.omit(userMock, ['id']),
        ..._.pick(userPasswordMock, ['password']),
      });

      expect(userServiceMock.readByEmail).toHaveBeenCalledTimes(1);
      expect(userServiceMock.create).toHaveBeenCalledTimes(1);
      expect(jwtServiceMock.signAsync).toHaveBeenCalledTimes(1);
      expect(userPasswordModelMock.create).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(authTokenMock);
    });
  });

  describe('signIn', () => {
    it('should return 422 when user does not exist', async () => {
      userServiceMock.readByEmail.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.signIn({
          ..._.pick(userMock, ['email']),
          ..._.pick(userPasswordMock, ['password']),
        });
      } catch (error) {
        err = error;
      }

      expect(userServiceMock.readByEmail).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when user needs to reset their password', async () => {
      userServiceMock.readByEmail.mockResolvedValue(userMock);
      userPasswordModelMock.findOne.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.signIn({
          ..._.pick(userMock, ['email']),
          password: faker.internet.password({
            length: PasswordLength.Min,
          }),
        });
      } catch (error) {
        err = error;
      }

      expect(userServiceMock.readByEmail).toHaveBeenCalledTimes(1);
      expect(userPasswordModelMock.findOne).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when user password is wrong', async () => {
      userServiceMock.readByEmail.mockResolvedValue(userMock);
      userPasswordModelMock.findOne.mockResolvedValue(userPasswordMock);
      bcryptMock.compare.mockResolvedValue(false as never);

      let err: UnprocessableEntityException;

      try {
        await service.signIn({
          ..._.pick(userMock, ['email']),
          password: faker.internet.password({
            length: PasswordLength.Min,
          }),
        });
      } catch (error) {
        err = error;
      }

      expect(userServiceMock.readByEmail).toHaveBeenCalledTimes(1);
      expect(userPasswordModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(bcryptMock.compare).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return auth token when user is deactivated', async () => {
      userServiceMock.readByEmail.mockResolvedValue({
        ...userMock,
        deleted_at: faker.date.anytime(),
      });
      userPasswordModelMock.findOne.mockResolvedValue({
        ...userPasswordMock,
        deleted_at: faker.date.anytime(),
      });
      bcryptMock.compare.mockResolvedValue(true as never);
      userPasswordMock.restore.mockResolvedValue({});
      userMock.restore.mockResolvedValue({});
      jwtServiceMock.signAsync.mockResolvedValue(authTokenMock.access_token);

      const { success, data } = await service.signIn({
        ..._.pick(userMock, ['email']),
        password: faker.internet.password({
          length: PasswordLength.Min,
        }),
      });

      expect(userServiceMock.readByEmail).toHaveBeenCalledTimes(1);
      expect(userPasswordModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(bcryptMock.compare).toHaveBeenCalledTimes(1);
      expect(userMock.restore).toHaveBeenCalledTimes(1);
      expect(userPasswordMock.restore).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(authTokenMock);
    });

    it('should return auth token', async () => {
      userServiceMock.readByEmail.mockResolvedValue(userMock);
      userPasswordModelMock.findOne.mockResolvedValue(userPasswordMock);
      bcryptMock.compare.mockResolvedValue(true as never);
      userPasswordMock.restore.mockResolvedValue({});
      userMock.restore.mockResolvedValue({});
      jwtServiceMock.signAsync.mockResolvedValue(authTokenMock.access_token);

      const { success, data } = await service.signIn({
        ..._.pick(userMock, ['email']),
        password: faker.internet.password({
          length: PasswordLength.Min,
        }),
      });

      expect(userServiceMock.readByEmail).toHaveBeenCalledTimes(1);
      expect(userPasswordModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(bcryptMock.compare).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(authTokenMock);
    });
  });

  describe('updateEmail', () => {
    it('should return 422 when user email is already theirs', async () => {
      userServiceMock.readByEmail.mockResolvedValue(userMock);

      let err: UnprocessableEntityException;

      try {
        await service.updateEmail(userMock.id, _.pick(userMock, ['email']));
      } catch (error) {
        err = error;
      }

      expect(userServiceMock.readByEmail).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when user email is not available', async () => {
      userServiceMock.readByEmail.mockResolvedValue({
        id: faker.string.uuid(),
        ..._.omit(userMock, ['id']),
      });

      let err: UnprocessableEntityException;

      try {
        await service.updateEmail(userMock.id, {
          email: faker.internet.email(),
        });
      } catch (error) {
        err = error;
      }

      expect(userServiceMock.readByEmail).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      userServiceMock.readByEmail.mockResolvedValue(null);
      userServiceMock.updateEmail.mockResolvedValue({});

      const { success } = await service.updateEmail(userMock.id, {
        email: faker.internet.email(),
      });

      expect(userServiceMock.readByEmail).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('updatePassword', () => {
    it('should return 422 when user needs to reset their password', async () => {
      userPasswordModelMock.findOne.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.updatePassword(userMock.id, {
          old_password: userPasswordMock.password,
          new_password: faker.internet.password({
            length: PasswordLength.Min,
          }),
        });
      } catch (error) {
        err = error;
      }

      expect(userPasswordModelMock.findOne).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when old user password is wrong', async () => {
      userPasswordModelMock.findOne.mockResolvedValue(userPasswordMock);
      bcryptMock.compare
        .mockResolvedValueOnce(false as never)
        .mockResolvedValueOnce(false as never);

      let err: UnprocessableEntityException;

      try {
        await service.updatePassword(userMock.id, {
          old_password: faker.internet.password({
            length: PasswordLength.Min,
          }),
          new_password: faker.internet.password({
            length: PasswordLength.Min,
          }),
        });
      } catch (error) {
        err = error;
      }

      expect(userPasswordModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(bcryptMock.compare).toHaveBeenCalledTimes(2);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when both old and new user passwords are identical', async () => {
      userPasswordModelMock.findOne.mockResolvedValue(userPasswordMock);
      bcryptMock.compare
        .mockResolvedValueOnce(true as never)
        .mockResolvedValueOnce(true as never);

      let err: UnprocessableEntityException;

      try {
        await service.updatePassword(userMock.id, {
          old_password: userPasswordMock.password,
          new_password: userPasswordMock.password,
        });
      } catch (error) {
        err = error;
      }

      expect(userPasswordModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(bcryptMock.compare).toHaveBeenCalledTimes(2);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      userPasswordModelMock.findOne.mockResolvedValue(userPasswordMock);
      bcryptMock.compare
        .mockResolvedValueOnce(true as never)
        .mockResolvedValueOnce(false as never);
      userPasswordMock.update.mockResolvedValue({});

      const { success } = await service.updatePassword(userMock.id, {
        old_password: userPasswordMock.password,
        new_password: faker.internet.password({
          length: PasswordLength.Min,
        }),
      });

      expect(userPasswordModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(bcryptMock.compare).toHaveBeenCalledTimes(2);
      expect(userPasswordMock.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('deactivate', () => {
    it('should return success', async () => {
      userServiceMock.delete.mockResolvedValue({});
      userPasswordModelMock.destroy.mockResolvedValue({});

      const { success } = await service.deactivate(userMock.id);

      expect(userServiceMock.delete).toHaveBeenCalledTimes(1);
      expect(userPasswordModelMock.destroy).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should return success', async () => {
      userServiceMock.delete.mockResolvedValue({});
      userPasswordModelMock.destroy.mockResolvedValue({});

      const { success } = await service.delete(userMock.id);

      expect(userServiceMock.delete).toHaveBeenCalledTimes(1);
      expect(userPasswordModelMock.destroy).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
