import currency from 'currency.js';
import { format, formatDuration, intervalToDuration } from 'date-fns';

export interface DailyRawData {
  transaction_pk: number;
  start_timestamp: string;
  stop_timestamp: string;
  start_value: number;
  stop_value: number;
}

export interface DailyData {
  transactionId: number;
  start: Date;
  stop: Date;
  chargingTime: Duration;
  energy: number;
  cost: currency;
}

export interface DailyDisplayData {
  transactionId: number;
  start: string;
  stop: string;
  chargingTime: string;
  energy: number;
  cost: string;
}

export const dateRawFormat = 'yyyy-MM-dd';
export const dateDisplayFormat = 'dd MMMM yyyy';
export const timestampDisplayFormat = 'dd MMMM yyyy, HH:mm:ss';

const costFactor = 2.466;
const currencyOptions = {
  symbol: 'Rp',
  separator: '.',
  decimal: ',',
  precision: 0,
};

export function parseDailyData(rawData: DailyRawData[]): DailyData[] {
  return rawData.map(d => {
    const start = new Date(d.start_timestamp);
    const stop = new Date(d.stop_timestamp);
    const energy = d.stop_value - d.start_value;

    return {
      transactionId: d.transaction_pk,
      start,
      stop,
      chargingTime: intervalToDuration({ start, end: stop }),
      energy,
      cost: currency(energy * costFactor, { ...currencyOptions, symbol: '' }),
    };
  });
}

export function displayDailyData(data: DailyData[]): DailyDisplayData[] {
  return data.map(d => ({
    ...d,
    start: format(d.start, timestampDisplayFormat),
    stop: format(d.stop, timestampDisplayFormat),
    chargingTime: formatDuration(d.chargingTime),
    cost: d.cost.format(),
  }));
}
