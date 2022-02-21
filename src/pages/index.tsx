import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Stasiun Pengisian Kendaraan Listrik ITB</title>
        <meta
          name="description"
          content="Stasiun Pengisian Kendaraan Listrik ITB"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <h1 className="font-bold text-red-500">SPKL ITB</h1>
      </main>
    </div>
  );
};

export default Home;
