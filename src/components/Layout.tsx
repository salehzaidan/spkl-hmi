import Head from 'next/head';
import Header from './Header';

interface Props {
  title: string;
  children: React.ReactNode;
}

function Layout({ title, children }: Props) {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] overflow-x-hidden">
      <Head>
        <title>Stasiun Pengisian Kendaraan Listrik ITB</title>
        <meta
          name="description"
          content="Stasiun Pengisian Kendaraan Listrik ITB"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="w-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-screen-lg">
          <h1 className="text-2xl font-medium">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
export default Layout;
