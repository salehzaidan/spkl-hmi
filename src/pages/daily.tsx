import type { NextPage } from 'next';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import Layout from '../components/Layout';
import Table from '../components/Table';
import type { DailyRawData } from '../lib/daily';
import { dateFormat } from '../lib/daily';
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
    dateFormat
  );

  return (
    <Layout title="Daily Transaction">
      <DatePicker
        selected={startDate}
        dateFormat={dateFormat}
        onChange={date => setStartDate(date)}
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
