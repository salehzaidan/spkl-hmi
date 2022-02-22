export interface DailyRawData {
  transaction_pk: number;
  start_timestamp: string;
  stop_timestamp: string;
  start_value: number;
  stop_value: number;
}

export const dateRawFormat = 'yyyy-MM-dd';
export const dateDisplayFormat = 'dd MMMM yyyy';
