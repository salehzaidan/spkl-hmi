import { eachMinuteOfInterval, format } from 'date-fns';
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
    timestamp: number;
    value: number;
  }[];
  ticks: number[];
  tickFormatter: (tick: number) => string;
  labelFormatter: (label: number) => string;
  formatter: (value: number) => [string, string?];
  values: DailyDisplayData[];
}

export const timestampChartFormat = 'HH:mm';
export const timestampChartDetailFormat = 'dd MMM yyyy, HH:mm:ss';

export function parseStationData(data: StationRawData): StationData {
  return {
    transactionId: data.id[0].transaction_pk,
    power: data.data_power
      .map(d => ({
        timestamp: new Date(d.value_timestamp),
        value: d.value,
      }))
      .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1)),
    values: parseDailyData(data.value_1),
  };
}

export function displayStationData(data: StationData): StationDisplayData {
  return {
    ...data,
    power: data.power.map(d => ({
      ...d,
      timestamp: d.timestamp.getTime(),
    })),
    ticks: eachMinuteOfInterval({
      start: data.power[0].timestamp,
      end: data.power[data.power.length - 1].timestamp,
    }).map(d => d.getTime()),
    tickFormatter: tick => format(tick, timestampChartFormat),
    labelFormatter: label => format(label, timestampChartDetailFormat),
    formatter: value => [`${value} W`, undefined],
    values: displayDailyData(data.values),
  };
}
