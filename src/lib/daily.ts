export interface DailyRawData {
  transaction_pk: number;
  start_timestamp: string;
  stop_timestamp: string;
  start_value: number;
  stop_value: number;
}

export const dateFormat = 'yyyy-MM-dd';
