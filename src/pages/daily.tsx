import type { NextPage } from 'next';
import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import CustomDateInput from '../components/CustomDateInput';
import Layout from '../components/Layout';
import Stat from '../components/Stat';
import Table from '../components/Table';
import type { DailyRawData } from '../lib/daily';
import {
  dateRawFormat,
  dateDisplayFormat,
  parseDailyData,
  displayDailyData,
  calcDailyStats,
} from '../lib/daily';
import useFilter from '../lib/hooks/useFilter';

import 'react-datepicker/dist/react-datepicker.css';

const columns = [
  { Header: 'Transaction ID', accessor: 'transactionId' },
  { Header: 'Start Date', accessor: 'start' },
  { Header: 'Stop Date', accessor: 'stop' },
  { Header: 'Charging Time', accessor: 'chargingTime' },
  { Header: 'Energy (Wh)', accessor: 'energy' },
  { Header: 'Cost (Rp)', accessor: 'cost' },
] as const;

const DailyPage: NextPage = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const {
    data: rawData,
    error,
    loading,
  } = useFilter<{ value: DailyRawData[] }>(
    `${process.env.NEXT_PUBLIC_DATA_PROVIDER}/daily`,
    startDate,
    dateRawFormat
  );

  const data = useMemo(() => {
    if (rawData) return parseDailyData(rawData.value);
  }, [rawData]);

  const displayData = useMemo(() => {
    if (data) return displayDailyData(data);
  }, [data]);

  const stats = useMemo(() => {
    if (data) return calcDailyStats(data);
  }, [data]);

  return (
    <Layout title="Daily Transaction">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr]">
        <div className="w-60 justify-self-center md:justify-self-start">
          <DatePicker
            selected={startDate}
            dateFormat={dateDisplayFormat}
            onChange={date => setStartDate(date)}
            // @ts-ignore
            customInput={<CustomDateInput icon="bi:calendar2-day" />}
          />
        </div>

        {!error && !loading && stats && (
          <div className="flex w-fit flex-col gap-4 justify-self-center md:flex-row lg:gap-8">
            <Stat type="transaction" value={stats.totalTransaction} />
            <Stat type="energy" value={stats.totalEnergy} />
            <Stat type="cost" value={stats.totalCost} />
          </div>
        )}

        {!error && !loading && displayData && (
          <Table
            className="md:col-span-2"
            columns={columns}
            data={displayData}
          />
        )}

        <p
          className={`${
            error ? 'text-red-500' : ''
          } self-center justify-self-center text-lg font-medium md:justify-self-start`}
        >
          {error
            ? 'Error, data could not be fetched'
            : loading
            ? 'Loading...'
            : null}
        </p>
      </div>
    </Layout>
  );
};

export default DailyPage;
