/**
 * Displays a select field.
 */
const Select = ({
  label = '',
  error = '',
  options,
  value,
  onChange,
  disabled = false,
  className = '',
}: {
  /** Label to display */
  label?: string;
  /** Error to display */
  error?: string;
  /** List of options */
  options: {
    label: string;
    value: string;
  }[];
  /** Value of the select */
  value: string;
  /** Function called when the value change, the new value is passed as parameter */
  onChange: (value: string) => void;
  /** Is the field disabled ? */
  disabled?: boolean;
  /** An optional class name to add to the container */
  className?: string;
}) => (
  <div className={`block relative w-full ${className}`}>
    <label>
      <div className={'block pb-1 text-main font-bold select-none'}>{label}</div>

      <select
        className={`${
          error ? '!border-red-600' : ''
        } w-full p-3 transition-colors duration-300 ease-in-out bg-white border-2 rounded-lg cursor-pointer border-primary focus:outline-none focus:border-primary-dark`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className={`text-red-600 transition-all duration-200 ease-in-out ${!error ? 'opacity-0' : ''}`}>
        {error ? error : ''}
      </div>
    </label>
  </div>
);

export default Select;
