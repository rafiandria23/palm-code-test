import _ from 'lodash';

import type { SuccessTimestamp } from '../interfaces/api';
import type {
  Country,
  Surfboard,
  CreateCountryPayload,
  CreateSurfboardPayload,
  ReadAllCountriesPayload,
  ReadCountryByIdPayload,
  ReadAllSurfboardsPayload,
  ReadSurfboardByIdPayload,
  UpdateCountryPayload,
  UpdateSurfboardPayload,
  DeleteCountryPayload,
  DeleteSurfboardPayload,
} from '../interfaces/setting';

import BaseClient from './base';

class SettingClient extends BaseClient {
  constructor() {
    super('/settings');
  }

  public async createCountry(payload: CreateCountryPayload) {
    const { data } = await this.client.post<
      SuccessTimestamp<undefined, Country>
    >('/countries', payload);

    return data;
  }

  public async createSurfboard(payload: CreateSurfboardPayload) {
    const { data } = await this.client.post<
      SuccessTimestamp<undefined, Country>
    >('/surfboards', payload);

    return data;
  }

  public async readAllCountries(payload?: ReadAllCountriesPayload) {
    const { data } = await this.client.get<
      SuccessTimestamp<{ total: number }, Country[]>
    >('/countries', {
      params: payload,
    });

    return data;
  }

  public async readCountryById(payload: ReadCountryByIdPayload) {
    const { data } = await this.client.get<
      SuccessTimestamp<undefined, Country>
    >(`/countries/${payload.id}`);

    return data;
  }

  public async readAllSurfboards(payload?: ReadAllSurfboardsPayload) {
    const { data } = await this.client.get<
      SuccessTimestamp<undefined, Surfboard[]>
    >('/surfboards', {
      params: payload,
    });

    return data;
  }

  public async readSurfboardById(payload: ReadSurfboardByIdPayload) {
    const { data } = await this.client.get<
      SuccessTimestamp<undefined, Surfboard>
    >(`/surfboards/${payload.id}`);

    return data;
  }

  public async updateCountry(payload: UpdateCountryPayload) {
    const { data } = await this.client.put<SuccessTimestamp>(
      `/countries/${payload.id}`,
      _.omit(payload, ['id']),
    );

    return data;
  }

  public async updateSurfboard(payload: UpdateSurfboardPayload) {
    const { data } = await this.client.put<SuccessTimestamp>(
      `/surfboards/${payload.id}`,
      _.omit(payload, ['id']),
    );

    return data;
  }

  public async deleteCountry(payload: DeleteCountryPayload) {
    const { data } = await this.client.delete<SuccessTimestamp>(
      `/countries/${payload.id}`,
    );

    return data;
  }

  public async deleteSurfboard(payload: DeleteSurfboardPayload) {
    const { data } = await this.client.delete<SuccessTimestamp>(
      `/surfboards/${payload.id}`,
    );

    return data;
  }
}

export default SettingClient;
