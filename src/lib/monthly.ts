import currency from 'currency.js';
import type { Stats } from './utils';
import { costFactor, currencyOptions } from './utils';

export interface MonthlyRawData {
  id: {
    transaction: number;
  }[];
  total: {
    date: number;
    total: number;
  }[];
}

export interface MonthlyData {
  transactionNum: number;
  daily: {
    date: number;
    energy: number;
    cost: currency;
  }[];
}

export const monthRawFormat = 'yyyy-MM';
export const monthDisplayFormat = 'MMMM yyyy';

export function parseMonthlyData(rawData: MonthlyRawData): MonthlyData {
  return {
    transactionNum: rawData.id[0].transaction,
    daily: rawData.total.map(day => ({
      date: day.date,
      energy: day.total,
      cost: currency(day.total * costFactor, {
        ...currencyOptions,
        symbol: '',
      }),
    })),
  };
}

export function calcMonthlyStats(data: MonthlyData): Stats {
  return {
    totalTransaction: data.transactionNum,
    totalEnergy: data.daily.reduce((previous, current) => ({
      ...current,
      energy: previous.energy + current.energy,
    })).energy,
    totalCost: data.daily.reduce((previous, current) => ({
      ...current,
      cost: previous.cost.add(current.cost),
    })).cost,
  };
}
