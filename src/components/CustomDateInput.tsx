import { forwardRef } from 'react';

interface Props {
  value: string;
  onClick: (e: React.FormEvent<HTMLButtonElement>) => void;
}

const CustomDateInput = forwardRef<HTMLButtonElement, Props>(
  ({ value, onClick }, ref) => {
    return (
      <button
        className="w-full rounded border border-gray-300 bg-white px-2.5 py-1 text-left hover:bg-indigo-50"
        ref={ref}
        onClick={onClick}
      >
        {value || 'Select date'}
      </button>
    );
  }
);
CustomDateInput.displayName = 'CustomDateInput';

export default CustomDateInput;
