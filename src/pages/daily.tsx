import type { NextPage } from 'next';
import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
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

const headers = [
  { label: 'Transaction ID', key: 'transactionId' },
  { label: 'Start Date', key: 'start' },
  { label: 'Stop Date', key: 'stop' },
  { label: 'Charging Time', key: 'chargingTime' },
  { label: 'Energy (Wh)', key: 'energy' },
  { label: 'Cost (Rp)', key: 'cost' },
];

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
        <div className="grid w-fit grid-cols-[1fr_auto] grid-rows-[auto_auto] justify-items-center gap-2 justify-self-center">
          <div className="w-60">
            <DatePicker
              selected={startDate}
              dateFormat={dateDisplayFormat}
              onChange={date => setStartDate(date)}
              // @ts-ignore
              customInput={<CustomDateInput icon="bi:calendar2-day" />}
            />
          </div>

          {startDate && (
            <button onClick={() => setStartDate(null)}>
              <Icon
                icon="charm:cross"
                className="h-6 w-6 text-red-600 hover:text-red-700"
              />
            </button>
          )}

          {!error && !loading && displayData && startDate && (
            <CSVLink
              className="inline-block justify-self-start rounded bg-green-600 px-3 py-1.5 text-white hover:bg-green-700"
              headers={headers}
              data={displayData}
              filename={`SPKL_${format(startDate, dateRawFormat)}`}
            >
              Export
            </CSVLink>
          )}
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
          } mt-0.5 justify-self-center text-lg font-medium md:justify-self-start`}
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
