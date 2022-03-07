import type { NextPage } from 'next';
import { useMemo } from 'react';
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Layout from '../components/Layout';
import Table from '../components/Table';
import useFilter from '../lib/hooks/useFilter';
import type { StationRawData } from '../lib/station';
import { parseStationData, displayStationData } from '../lib/station';

const columns = [
  { Header: 'Transaction ID', accessor: 'transactionId' },
  { Header: 'Start Date', accessor: 'start' },
  { Header: 'Stop Date', accessor: 'stop' },
  { Header: 'Charging Time', accessor: 'chargingTime' },
  { Header: 'Total Energy (Wh)', accessor: 'energy' },
  { Header: 'Cost (Rp)', accessor: 'cost' },
] as const;

const StationPage: NextPage = () => {
  const {
    data: rawData,
    error,
    loading,
  } = useFilter<StationRawData>(
    `${process.env.NEXT_PUBLIC_DATA_PROVIDER}/charge`,
    {
      useParam: false,
      delay: Number(process.env.NEXT_PUBLIC_STATION_DELAY) * 1000,
    }
  );

  const data = useMemo(() => {
    if (rawData) return parseStationData(rawData);
  }, [rawData]);

  const displayData = useMemo(() => {
    if (data) return displayStationData(data);
  }, [data]);

  return (
    <Layout title="Charging Station">
      {!error && !loading && displayData && (
        <>
          <h2 className="text-center text-xl font-medium">
            Transaction {displayData.transactionId}
          </h2>
          <ResponsiveContainer aspect={3}>
            <LineChart
              data={displayData.power}
              margin={{ top: 5, right: 5, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray={4} />
              <XAxis
                dataKey="timestamp"
                domain={['dataMin', 'dataMax']}
                tickFormatter={displayData.tickFormatter}
                ticks={displayData.ticks}
                type="number"
                scale="time"
              >
                <Label position="insideBottom" dy={20}>
                  Time
                </Label>
              </XAxis>
              <YAxis>
                <Label position="insideLeft" angle={-90} dx={-5} dy={40}>
                  Power (Watt)
                </Label>
              </YAxis>
              <Tooltip
                labelFormatter={displayData.labelFormatter}
                formatter={displayData.formatter}
              />
              <Line
                dataKey="value"
                type="linear"
                stroke="rgb(67 56 202)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

          <Table className="mt-8" columns={columns} data={displayData.values} />
        </>
      )}

      <p className={`${error ? 'text-red-500' : ''} text-lg font-medium`}>
        {error
          ? 'Error, data could not be fetched'
          : loading
          ? 'Loading...'
          : null}
      </p>
    </Layout>
  );
};

export default StationPage;
