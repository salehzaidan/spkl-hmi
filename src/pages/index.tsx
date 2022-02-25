import type { NextPage } from 'next';
import { useMemo } from 'react';
import Layout from '../components/Layout';
import useFilter from '../lib/hooks/useFilter';
import type { StationRawData } from '../lib/station';
import { parseStationData, displayStationData } from '../lib/station';

const StationPage: NextPage = () => {
  const {
    data: rawData,
    error,
    loading,
  } = useFilter<StationRawData>(
    `${process.env.NEXT_PUBLIC_DATA_PROVIDER}/charge`,
    { useParam: false }
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
        <pre>{JSON.stringify(displayData, null, 2)}</pre>
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
