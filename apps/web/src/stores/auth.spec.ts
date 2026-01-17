import { faker } from '@faker-js/faker';

import type { AuthState } from '../interfaces/auth';
import authSlice from './auth';

describe('authSlice', () => {
  const authStateMock: AuthState = {
    loading: false,
    token: {
      access: faker.string.uuid(),
    },
  };

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should handle unknown action', () => {
    const result = authSlice.reducer(authStateMock, {
      type: faker.string.alpha(),
    });

    expect(result).toEqual(authStateMock);
  });

  it('should handle setLoading action', () => {
    const expectedLoading = faker.datatype.boolean();

    const result = authSlice.reducer(
      authStateMock,
      authSlice.actions.setLoading(expectedLoading),
    );

    expect(result.loading).toEqual(expectedLoading);
  });

  it('should handle setAccessToken action', () => {
    const expectedAccessToken = faker.string.uuid();

    const result = authSlice.reducer(
      authStateMock,
      authSlice.actions.setAccessToken(expectedAccessToken),
    );

    expect(result.token.access).toEqual(expectedAccessToken);
  });
});
