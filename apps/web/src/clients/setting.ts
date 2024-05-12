import type { SuccessTimestamp } from '../interfaces/api';
import type { Country, Surfboard } from '../interfaces/setting';

import BaseClient from './base';

class SettingClient extends BaseClient {
  constructor() {
    super('/settings');
  }

  public async createCountry() {
    const { data } = await this.client.post<
      SuccessTimestamp<undefined, Country>
    >('/countries');

    return data;
  }

  public async createSurfboard() {
    const { data } = await this.client.post<
      SuccessTimestamp<undefined, Country>
    >('/surfboards');

    return data;
  }

  public async readAllCountries() {
    const { data } = await this.client.get<
      SuccessTimestamp<{ total: number }, Country[]>
    >('/countries');

    return data;
  }

  public async readCountryById(id: string) {
    const { data } = await this.client.get<
      SuccessTimestamp<undefined, Country>
    >(`/countries/${id}`);

    return data;
  }

  public async readAllSurfboards() {
    const { data } = await this.client.get<
      SuccessTimestamp<undefined, Surfboard[]>
    >('/surfboards');

    return data;
  }

  public async readSurfboardById(id: string) {
    const { data } = await this.client.get<
      SuccessTimestamp<undefined, Surfboard>
    >(`/surfboards/${id}`);

    return data;
  }

  public async updateCountry(id: string) {
    const { data } = await this.client.put<SuccessTimestamp>(
      `/countries/${id}`,
    );

    return data;
  }

  public async updateSurfboard(id: string) {
    const { data } = await this.client.put<SuccessTimestamp>(
      `/surfboards/${id}`,
    );

    return data;
  }

  public async deleteCountry(id: string) {
    const { data } = await this.client.delete<SuccessTimestamp>(
      `/countries/${id}`,
    );

    return data;
  }

  public async deleteSurfboard(id: string) {
    const { data } = await this.client.delete<SuccessTimestamp>(
      `/surfboards/${id}`,
    );

    return data;
  }
}

export default SettingClient;
