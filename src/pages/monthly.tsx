import type { NextPage } from 'next';
import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
import DatePicker from 'react-datepicker';
import CustomDateInput from '../components/CustomDateInput';
import Layout from '../components/Layout';
import Stat from '../components/Stat';
import type { MonthlyRawData } from '../lib/monthly';
import {
  calcMonthlyStats,
  monthDisplayFormat,
  monthRawFormat,
  parseMonthlyData,
  displayMonthlyData,
} from '../lib/monthly';
import useFilter from '../lib/hooks/useFilter';

import 'react-datepicker/dist/react-datepicker.css';
import {
  Bar,
  BarChart,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const headers = [
  { label: 'Date', key: 'date' },
  { label: 'Energy (Wh)', key: 'energy' },
  { label: 'Cost (Rp)', key: 'cost' },
];

const MonthlyPage: NextPage = () => {
  const [startMonth, setStartMonth] = useState<Date | null>(null);
  const {
    data: rawData,
    error,
    loading,
  } = useFilter<{ value: MonthlyRawData[] }>(
    `${process.env.NEXT_PUBLIC_DATA_PROVIDER}/monthly`,
    { date: startMonth, dateFormat: monthRawFormat }
  );

  const data = useMemo(() => {
    if (rawData) return parseMonthlyData(rawData.value[0]);
  }, [rawData]);

  const displayData = useMemo(() => {
    if (data) return displayMonthlyData(data);
  }, [data]);

  const stats = useMemo(() => {
    if (data) return calcMonthlyStats(data);
  }, [data]);

  return (
    <Layout title="Monthly Transaction">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr]">
        <div className="grid w-fit grid-cols-[1fr_auto] grid-rows-[auto_auto] justify-items-center gap-2 justify-self-center">
          <div className="w-60">
            <DatePicker
              selected={startMonth}
              dateFormat={monthDisplayFormat}
              onChange={date => setStartMonth(date)}
              customInput={
                // @ts-ignore
                <CustomDateInput icon="bi:calendar2-month" />
              }
              showMonthYearPicker
              placeholderText="Select month"
            />
          </div>

          {startMonth && (
            <button onClick={() => setStartMonth(null)}>
              <Icon
                icon="charm:cross"
                className="h-6 w-6 text-red-600 hover:text-red-700"
              />
            </button>
          )}

          {!error && !loading && data && startMonth && (
            <CSVLink
              className="inline-block justify-self-start rounded bg-green-600 px-3 py-1.5 text-white hover:bg-green-700"
              headers={headers}
              data={data.daily}
              filename={`SPKL_${format(startMonth, monthRawFormat)}`}
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

        {!error && !loading && displayData && startMonth && (
          <ResponsiveContainer aspect={3} className="md:col-span-2">
            <BarChart
              data={displayData.daily}
              margin={{ top: 5, right: 5, bottom: 20, left: 20 }}
            >
              <XAxis dataKey="date">
                <Label position="insideBottom" dy={20}>
                  Date
                </Label>
              </XAxis>
              <YAxis>
                <Label position="insideLeft" angle={-90} dx={-5} dy={40}>
                  Energy (Wh)
                </Label>
              </YAxis>
              <Tooltip
                labelFormatter={label =>
                  displayData.labelFormatter(label, startMonth)
                }
                formatter={displayData.formatter}
              />
              <Bar dataKey="energy" fill="rgb(67 56 202)" />
            </BarChart>
          </ResponsiveContainer>
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

export default MonthlyPage;
