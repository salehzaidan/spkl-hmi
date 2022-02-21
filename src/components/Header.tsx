import { Icon } from '@iconify/react';
import MyLink from './MyLink';

const navigations = [
  { icon: 'carbon:charging-station', name: 'Charging Station', href: '/' },
  { icon: 'bi:calendar2-day', name: 'Daily Transaction', href: '/daily' },
  { icon: 'bi:calendar2-month', name: 'Monthly Transaction', href: '/monthly' },
];

function Header() {
  return (
    <header className="flex gap-16 bg-indigo-700 px-8 py-4 text-white">
      <h1 className="text-lg font-semibold leading-tight">
        Stasiun Pengisian Kendaraan Listrik
        <div className="text-sm font-medium">Institut Teknologi Bandung</div>
      </h1>

      <nav className="hidden items-center gap-4 md:flex">
        {navigations.map(navigation => (
          <MyLink
            href={navigation.href}
            className="flex items-center gap-2 rounded px-4 py-2 hover:bg-indigo-800"
            key={navigation.name}
          >
            <Icon
              icon={navigation.icon}
              className="inline-block h-6 w-6 shrink-0"
            />
            <span className="leading-tight">{navigation.name}</span>
          </MyLink>
        ))}
      </nav>
    </header>
  );
}

export default Header;
