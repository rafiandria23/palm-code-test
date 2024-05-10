import type { SuccessTimestamp } from '../interfaces/api';
import type { Country } from '../interfaces/country';
import type { Surfboard } from '../interfaces/surfboard';
import BaseClient from './base';

class SettingClient extends BaseClient {
  constructor() {
    super('/settings');
  }

  async readCountryById(
    id: string,
  ): Promise<SuccessTimestamp<undefined, Country>> {
    const { data } = await this.client.get<
      SuccessTimestamp<undefined, Country>
    >(`/countries/${id}`);

    return data;
  }

  async readAllCountries(): Promise<
    SuccessTimestamp<{ total: number }, Country[]>
  > {
    const { data } = await this.client.get<
      SuccessTimestamp<{ total: number }, Country[]>
    >('/countries');

    return data;
  }

  async readSurfboardById(
    id: string,
  ): Promise<SuccessTimestamp<undefined, Surfboard>> {
    const { data } = await this.client.get<
      SuccessTimestamp<undefined, Surfboard>
    >(`/surfboards/${id}`);

    return data;
  }

  async readAllSurfboards(): Promise<SuccessTimestamp<undefined, Surfboard[]>> {
    const { data } = await this.client.get<
      SuccessTimestamp<undefined, Surfboard[]>
    >('/surfboards');

    return data;
  }
}

export default SettingClient;
