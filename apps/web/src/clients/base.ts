import _ from 'lodash';
import type { AxiosInstance, CreateAxiosDefaults } from 'axios';
import axios from 'axios';

class BaseClient {
  protected readonly client: AxiosInstance;

  constructor(
    domainUrl: string,
    options?: Omit<CreateAxiosDefaults, 'baseURL'> & { version: string },
  ) {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL env has to be set!');
    }

    if (!domainUrl) {
      throw new Error('Domain URL parameter has to be set!');
    }

    const apiVersion = _.defaultTo(_.get(options, 'version'), 'v1');

    this.client = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${apiVersion}${domainUrl}`,
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HARDCODED_ACCESS_TOKEN}`,
      },
    });
  }
}

export default BaseClient;
