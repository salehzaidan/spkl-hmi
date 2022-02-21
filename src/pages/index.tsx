import type { NextPage } from 'next';
import Head from 'next/head';

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

      <main>
        <h1 className="text-red-500 font-bold">SPKL ITB</h1>
      </main>
    </div>
  );
};

export default Home;
