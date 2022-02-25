import { format } from 'date-fns';
import type { DailyData, DailyDisplayData, DailyRawData } from './daily';
import { parseDailyData, displayDailyData } from './daily';

export interface StationRawData {
  id: { transaction_pk: number }[];
  data_power: {
    value_timestamp: string;
    value: number;
  }[];
  value_1: DailyRawData[];
}

export interface StationData {
  transactionId: number;
  power: {
    timestamp: Date;
    value: number;
  }[];
  values: DailyData[];
}

export interface StationDisplayData {
  transactionId: number;
  power: {
    timestamp: string;
    value: number;
  }[];
  values: DailyDisplayData[];
}

export const timestampChartFormat = 'HH:mm:ss';

export function parseStationData(data: StationRawData): StationData {
  return {
    transactionId: data.id[0].transaction_pk,
    power: data.data_power.map(d => ({
      timestamp: new Date(d.value_timestamp),
      value: d.value,
    })),
    values: parseDailyData(data.value_1),
  };
}

export function displayStationData(data: StationData): StationDisplayData {
  return {
    ...data,
    power: data.power.map(d => ({
      ...d,
      timestamp: format(d.timestamp, timestampChartFormat),
    })),
    values: displayDailyData(data.values),
  };
}
