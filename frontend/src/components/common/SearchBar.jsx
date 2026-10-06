import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  value: controlledValue,
  onChange: controlledOnChange,
}) {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    if (onSearch) onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (isControlled) {
      controlledOnChange?.(e);
    } else {
      setInternalValue(val);
    }
  };

  const handleClear = () => {
    if (isControlled) {
      controlledOnChange?.({ target: { value: '' } });
    } else {
      setInternalValue('');
    }
    onSearch?.('');
  };

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-xl border border-dark-200 bg-white py-2.5 pl-10 pr-10 text-sm text-dark-900 shadow-xs transition-all duration-200 placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-dark-400 transition-colors hover:bg-dark-100 hover:text-dark-600"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
