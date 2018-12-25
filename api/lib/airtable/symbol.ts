export enum AirtableView {
  GRID = 'Grid view'
}

export interface AirtableApiResponse<T> {
  _table: AirtableTableInfo;
  id: string;
  _rawJson: AirtabkeRawJson<T>;
  fields: T;
}

export interface AirtableTableInfo {
  _base: AirtableBaseInfo;
  id: null;
  name: string;
}

export interface AirtableBaseInfo {
  _airtable: AirtableConfigInfo;
  _id: string;
}

export interface AirtableConfigInfo {
  _apiKey: string;
  _endpointUrl: string;
  _apiVersion: string;
  _apiVersionMajor: string;
  _allowUnauthorizedSsl: boolean;
  _noRetryIfRateLimited: boolean;
  requestTimeout: number;
}

export interface AirtabkeRawJson<T> {
  id: string;
  fields: T;
  createdTime: string;
}

export interface AirtableCartItems {
  quantity: number;
  id: string;
  createdAt: string;
  customerCartId: string;
  stripeSkuId: string;
}

