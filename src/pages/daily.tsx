import type { NextPage } from 'next';
import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import CustomDateInput from '../components/CustomDateInput';
import Layout from '../components/Layout';
import Table from '../components/Table';
import type { DailyRawData, DailyData } from '../lib/daily';
import {
  dateDisplayFormat,
  dateRawFormat,
  parseDailyData,
  displayDailyData,
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

  return (
    <Layout title="Daily Transaction">
      <DatePicker
        selected={startDate}
        dateFormat={dateDisplayFormat}
        onChange={date => setStartDate(date)}
        customInput={React.createElement(CustomDateInput)}
        wrapperClassName="!w-60"
      />

      {error ? (
        <p>There is an error</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : displayData ? (
        <Table columns={columns} data={displayData} />
      ) : null}
    </Layout>
  );
};

export default DailyPage;
