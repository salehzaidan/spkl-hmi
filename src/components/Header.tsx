import { Menu } from '@headlessui/react';
import { Icon } from '@iconify/react';
import MyLink from './MyLink';

const navigations = [
  { icon: 'carbon:charging-station', name: 'Charging Station', href: '/' },
  { icon: 'bi:calendar2-day', name: 'Daily Transaction', href: '/daily' },
  { icon: 'bi:calendar2-month', name: 'Monthly Transaction', href: '/monthly' },
];

function Header() {
  return (
    <header className="flex items-center justify-between gap-16 bg-indigo-700 px-8 py-4 text-white md:justify-start">
      <h1 className="text-lg font-semibold leading-tight">
        Stasiun Pengisian Kendaraan Listrik
        <div className="text-sm font-medium">Institut Teknologi Bandung</div>
      </h1>

      <Menu as="div" className="relative z-10 md:hidden">
        <Menu.Button className="w-11 space-y-1.5 rounded px-2.5 py-2 hover:bg-indigo-800">
          <div className="h-0.5 bg-white" />
          <div className="h-0.5 bg-white" />
          <div className="h-0.5 bg-white" />
        </Menu.Button>
        <Menu.Items className="absolute right-2 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded bg-white shadow">
          <div className="p-1">
            {navigations.map(navigation => (
              <Menu.Item key={navigation.name}>
                {({ active }) => (
                  <MyLink
                    href={navigation.href}
                    className={`${
                      active ? 'bg-indigo-700 text-white' : 'text-gray-900'
                    } flex items-center gap-2 rounded p-2 text-sm`}
                  >
                    <Icon
                      icon={navigation.icon}
                      className="inline-block h-4 w-4 shrink-0"
                    />
                    {navigation.name}
                  </MyLink>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Menu>

      <nav className="hidden gap-4 md:flex">
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
