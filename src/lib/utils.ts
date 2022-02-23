import currency from 'currency.js';

export interface Stats {
  totalTransaction: number;
  totalEnergy: number;
  totalCost: currency;
}

export const costFactor = 2.466;
export const currencyOptions = {
  symbol: 'Rp',
  separator: '.',
  decimal: ',',
  precision: 0,
};
