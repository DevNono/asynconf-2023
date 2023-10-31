import { useState } from 'react';

/**
 * Displays a select field.
 */
const RangeInput = ({
  label = '',
  error = '',
  min,
  max,
  unit = '',
  step = 1,
  value,
  onChange,
  disabled = false,
  className = '',
}: {
  /** Label to display */
  label?: string;
  /** Error to display */
  error?: string;
  /** Minimal value */
  min: number;
  /** Maximal value */
  max: number;
  /** Unit to display */
  unit?: string;
  /** Step value */
  step?: number;
  /** Value of the select */
  value: string;
  /** Function called when the value change, the new value is passed as parameter */
  onChange: (value: string) => void;
  /** Is the field disabled ? */
  disabled?: boolean;
  /** An optional class name to add to the container */
  className?: string;
}) => {
  const [currentValue, setCurrentValue] = useState(value || min || 0);

  return (
    <div className={`block relative w-full ${className}`}>
      <label>
        <div className={'block pb-1 text-main font-bold select-none'}>{label}</div>
        <div className="p-1 price-range">
          <span className={`text-sm transition-all duration-200 ease-in-out ${!value ? 'opacity-0' : ''}`}>
            {currentValue} {unit}
          </span>
          <input
            className={`${
              error ? '!accent-red-600' : ''
            }  w-full h-3 transition-colors duration-300 ease-in-out bg-gray-200 rounded-lg cursor-pointer accent-primary`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              setCurrentValue(e.target.value);
              onChange(e.target.value);
            }}
            disabled={disabled}
          />
          <div className="flex justify-between w-full -mt-1">
            <span className="text-sm text-gray-600">{min}</span>
            <span className="text-sm text-gray-600">{max}</span>
          </div>
        </div>
        <div className={`text-red-600 transition-all duration-200 ease-in-out ${!error ? 'opacity-0' : ''}`}>
          {error ? error : ''}
        </div>
      </label>
    </div>
  );
};

export default RangeInput;
