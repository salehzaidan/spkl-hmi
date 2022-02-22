import type { NextPage } from 'next';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import CustomDateInput from '../components/CustomDateInput';
import Layout from '../components/Layout';
import Table from '../components/Table';
import type { DailyRawData } from '../lib/daily';
import { dateDisplayFormat, dateRawFormat } from '../lib/daily';
import useFilter from '../lib/hooks/useFilter';

import 'react-datepicker/dist/react-datepicker.css';

const columns = [
  { Header: 'Transaction ID', accessor: 'transaction_pk' },
  { Header: 'Start Date', accessor: 'start_timestamp' },
  { Header: 'Stop Date', accessor: 'stop_timestamp' },
  { Header: 'Start Value', accessor: 'start_value' },
  { Header: 'Stop Value', accessor: 'stop_value' },
] as const;

const DailyPage: NextPage = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const { data, error, loading } = useFilter<{ value: DailyRawData[] }>(
    `${process.env.NEXT_PUBLIC_DATA_PROVIDER}/daily`,
    startDate,
    dateRawFormat
  );

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
      ) : data ? (
        <Table columns={columns} data={data.value} />
      ) : null}
    </Layout>
  );
};

export default DailyPage;
