import { Icon } from '@iconify/react';
import { forwardRef } from 'react';

interface Props {
  icon: string;
  value: string;
  onClick: (e: React.FormEvent<HTMLButtonElement>) => void;
}

const CustomDateInput = forwardRef<HTMLButtonElement, Props>(
  ({ icon, value, onClick }, ref) => {
    return (
      <button
        className="flex w-full items-center gap-2.5 rounded border border-gray-300 bg-white px-2.5 py-1 text-left hover:bg-indigo-50"
        ref={ref}
        onClick={onClick}
      >
        <Icon icon={icon} />
        {value || 'Select date'}
      </button>
    );
  }
);
CustomDateInput.displayName = 'CustomDateInput';

export default CustomDateInput;
