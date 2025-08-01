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

  const mockedUserPasswordModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  };

  const mockedJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockedUserService = {
    create: jest.fn(),
    readByEmail: jest.fn(),
    updateEmail: jest.fn(),
    delete: jest.fn(),
  };

  const mockedBcrypt = {
    compare: jest.spyOn(bcrypt, 'compare'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(UserPassword),
          useValue: mockedUserPasswordModel,
        },
        ConfigService,
        CommonService,
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: UserService,
          useValue: mockedUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  const mockedUser = {
    id: faker.string.uuid(),

    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),

    created_at: faker.date.anytime(),
    updated_at: faker.date.anytime(),
    deleted_at: null,

    restore: jest.fn(),
  };

  const mockedUserPassword = {
    id: faker.string.uuid(),

    user_id: mockedUser.id,
    password: faker.internet.password({
      length: PasswordLength.Min,
    }),

    created_at: faker.date.anytime(),
    updated_at: faker.date.anytime(),
    deleted_at: null,

    update: jest.fn(),
    restore: jest.fn(),
  };

  const mockedAuthToken = {
    access_token: faker.string.alphanumeric(),
  };

  describe('signUp', () => {
    it('should return 422 when user already exists', async () => {
      mockedUserService.readByEmail.mockResolvedValue(mockedUser);

      let err: UnprocessableEntityException;

      try {
        await service.signUp({
          ..._.omit(mockedUser, ['id']),
          ..._.pick(mockedUserPassword, ['password']),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserService.readByEmail).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return auth token', async () => {
      mockedUserService.readByEmail.mockResolvedValue(null);
      mockedUserService.create.mockResolvedValue(mockedUser);
      mockedJwtService.signAsync.mockResolvedValue(
        mockedAuthToken.access_token,
      );
      mockedUserPasswordModel.create.mockResolvedValue(mockedUserPassword);

      const { success, data } = await service.signUp({
        ..._.omit(mockedUser, ['id']),
        ..._.pick(mockedUserPassword, ['password']),
      });

      expect(mockedUserService.readByEmail).toHaveBeenCalledTimes(1);
      expect(mockedUserService.create).toHaveBeenCalledTimes(1);
      expect(mockedJwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(mockedUserPasswordModel.create).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedAuthToken);
    });
  });

  describe('signIn', () => {
    it('should return 422 when user does not exist', async () => {
      mockedUserService.readByEmail.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.signIn({
          ..._.pick(mockedUser, ['email']),
          ..._.pick(mockedUserPassword, ['password']),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserService.readByEmail).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when user needs to reset their password', async () => {
      mockedUserService.readByEmail.mockResolvedValue(mockedUser);
      mockedUserPasswordModel.findOne.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.signIn({
          ..._.pick(mockedUser, ['email']),
          password: faker.internet.password({
            length: PasswordLength.Min,
          }),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserService.readByEmail).toHaveBeenCalledTimes(1);
      expect(mockedUserPasswordModel.findOne).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when user password is wrong', async () => {
      mockedUserService.readByEmail.mockResolvedValue(mockedUser);
      mockedUserPasswordModel.findOne.mockResolvedValue(mockedUserPassword);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      let err: UnprocessableEntityException;

      try {
        await service.signIn({
          ..._.pick(mockedUser, ['email']),
          password: faker.internet.password({
            length: PasswordLength.Min,
          }),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserService.readByEmail).toHaveBeenCalledTimes(1);
      expect(mockedUserPasswordModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return auth token when user is deactivated', async () => {
      mockedUserService.readByEmail.mockResolvedValue({
        ...mockedUser,
        deleted_at: faker.date.anytime(),
      });
      mockedUserPasswordModel.findOne.mockResolvedValue({
        ...mockedUserPassword,
        deleted_at: faker.date.anytime(),
      });
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedUserPassword.restore.mockResolvedValue({});
      mockedUser.restore.mockResolvedValue({});
      mockedJwtService.signAsync.mockResolvedValue(
        mockedAuthToken.access_token,
      );

      const { success, data } = await service.signIn({
        ..._.pick(mockedUser, ['email']),
        password: faker.internet.password({
          length: PasswordLength.Min,
        }),
      });

      expect(mockedUserService.readByEmail).toHaveBeenCalledTimes(1);
      expect(mockedUserPasswordModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);
      expect(mockedUser.restore).toHaveBeenCalledTimes(1);
      expect(mockedUserPassword.restore).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedAuthToken);
    });

    it('should return auth token', async () => {
      mockedUserService.readByEmail.mockResolvedValue(mockedUser);
      mockedUserPasswordModel.findOne.mockResolvedValue(mockedUserPassword);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedUserPassword.restore.mockResolvedValue({});
      mockedUser.restore.mockResolvedValue({});
      mockedJwtService.signAsync.mockResolvedValue(
        mockedAuthToken.access_token,
      );

      const { success, data } = await service.signIn({
        ..._.pick(mockedUser, ['email']),
        password: faker.internet.password({
          length: PasswordLength.Min,
        }),
      });

      expect(mockedUserService.readByEmail).toHaveBeenCalledTimes(1);
      expect(mockedUserPasswordModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedAuthToken);
    });
  });

  describe('updateEmail', () => {
    it('should return 422 when user email is already theirs', async () => {
      mockedUserService.readByEmail.mockResolvedValue(mockedUser);

      let err: UnprocessableEntityException;

      try {
        await service.updateEmail(mockedUser.id, _.pick(mockedUser, ['email']));
      } catch (error) {
        err = error;
      }

      expect(mockedUserService.readByEmail).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when user email is not available', async () => {
      mockedUserService.readByEmail.mockResolvedValue({
        id: faker.string.uuid(),
        ..._.omit(mockedUser, ['id']),
      });

      let err: UnprocessableEntityException;

      try {
        await service.updateEmail(mockedUser.id, {
          email: faker.internet.email(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserService.readByEmail).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      mockedUserService.readByEmail.mockResolvedValue(null);
      mockedUserService.updateEmail.mockResolvedValue({});

      const { success } = await service.updateEmail(mockedUser.id, {
        email: faker.internet.email(),
      });

      expect(mockedUserService.readByEmail).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('updatePassword', () => {
    it('should return 422 when user needs to reset their password', async () => {
      mockedUserPasswordModel.findOne.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.updatePassword(mockedUser.id, {
          old_password: mockedUserPassword.password,
          new_password: faker.internet.password({
            length: PasswordLength.Min,
          }),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserPasswordModel.findOne).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when old user password is wrong', async () => {
      mockedUserPasswordModel.findOne.mockResolvedValue(mockedUserPassword);
      mockedBcrypt.compare
        .mockResolvedValueOnce(false as never)
        .mockResolvedValueOnce(false as never);

      let err: UnprocessableEntityException;

      try {
        await service.updatePassword(mockedUser.id, {
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

      expect(mockedUserPasswordModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(2);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when both old and new user passwords are identical', async () => {
      mockedUserPasswordModel.findOne.mockResolvedValue(mockedUserPassword);
      mockedBcrypt.compare
        .mockResolvedValueOnce(true as never)
        .mockResolvedValueOnce(true as never);

      let err: UnprocessableEntityException;

      try {
        await service.updatePassword(mockedUser.id, {
          old_password: mockedUserPassword.password,
          new_password: mockedUserPassword.password,
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserPasswordModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(2);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      mockedUserPasswordModel.findOne.mockResolvedValue(mockedUserPassword);
      mockedBcrypt.compare
        .mockResolvedValueOnce(true as never)
        .mockResolvedValueOnce(false as never);
      mockedUserPassword.update.mockResolvedValue({});

      const { success } = await service.updatePassword(mockedUser.id, {
        old_password: mockedUserPassword.password,
        new_password: faker.internet.password({
          length: PasswordLength.Min,
        }),
      });

      expect(mockedUserPasswordModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(2);
      expect(mockedUserPassword.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('deactivate', () => {
    it('should return success', async () => {
      mockedUserService.delete.mockResolvedValue({});
      mockedUserPasswordModel.destroy.mockResolvedValue({});

      const { success } = await service.deactivate(mockedUser.id);

      expect(mockedUserService.delete).toHaveBeenCalledTimes(1);
      expect(mockedUserPasswordModel.destroy).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should return success', async () => {
      mockedUserService.delete.mockResolvedValue({});
      mockedUserPasswordModel.destroy.mockResolvedValue({});

      const { success } = await service.delete(mockedUser.id);

      expect(mockedUserService.delete).toHaveBeenCalledTimes(1);
      expect(mockedUserPasswordModel.destroy).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
