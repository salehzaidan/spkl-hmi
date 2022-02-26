import currency from 'currency.js';
import { format } from 'date-fns';
import { timestampChartDetailFormat } from './station';
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

export interface MonthlyDisplayData {
  transactionNum: number;
  daily: {
    date: number;
    energy: number;
    cost: string;
  }[];
  labelFormatter: (label: number, startMonth: Date) => string;
  formatter: (value: number) => [string, string?];
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

export function displayMonthlyData(data: MonthlyData): MonthlyDisplayData {
  return {
    ...data,
    daily: data.daily.map(d => {
      return {
        ...d,
        cost: d.cost.format(),
      };
    }),
    labelFormatter: (label, startMonth) =>
      `${label} ${format(startMonth, monthDisplayFormat)}`,
    formatter: value => [`${value} Wh`, undefined],
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
