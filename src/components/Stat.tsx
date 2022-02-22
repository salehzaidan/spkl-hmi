import { useMemo } from 'react';
import { Icon } from '@iconify/react';
import currency from 'currency.js';
import { currencyOptions } from '../lib/daily';

interface Props {
  type: 'transaction' | 'energy' | 'cost';
  value: number | currency;
}

function Stat({ type, value }: Props) {
  const [name, icon, displayValue] = useMemo(() => {
    switch (type) {
      case 'transaction':
        return [
          'Total Transaction',
          'icon-park-outline:transaction-order',
          value.toString(),
        ];
      case 'energy':
        return [
          'Total Energy',
          'icon-park-outline:energy-socket',
          `${value} Wh`,
        ];
      case 'cost':
        return [
          'Total Cost',
          'ic:baseline-attach-money',
          (value as currency).format(currencyOptions),
        ];
    }
  }, [type, value]);

  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-12 w-12 shrink-0 text-indigo-700" icon={icon} />
      <div>
        <p className="text-sm font-medium uppercase text-indigo-800">{name}</p>
        <p className="whitespace-nowrap text-lg">{displayValue}</p>
      </div>
    </div>
  );
}

export default Stat;
