import styles from './Animation.module.scss';

/**
 * Displays a select field.
 */
const Input = ({
  type = 'text',
  label = '',
  error = '',
  value,
  placeholder = '',
  onChange,
  disabled = false,
  className = '',
}: {
  /** Type of the input */
  type?: 'text' | 'number' | 'email' | 'password';
  /** Label to display */
  label?: string;
  /** Error to display */
  error?: string;
  /** Value of the select */
  value: string;
  /** Placeholder to display */
  placeholder?: string;
  /** Function called when the value change, the new value is passed as parameter */
  onChange: (value: string) => void;
  /** Is the field disabled ? */
  disabled?: boolean;
  /** An optional class name to add to the container */
  className?: string;
}) => (
  <div className={`block relative w-full ${className}`}>
    <label>
      <div className={'block pb-0.5 text-main font-bold select-none'}>{label}</div>

      <input
        className={`${
          error ? '!border-red-600' : ''
        } w-full p-3 transition-colors duration-300 ease-in-out bg-white border-2 rounded-lg cursor-pointer border-primary focus:outline-none focus:border-primary-dark ${
          error ? styles.shake : ''
        }`}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <div className={`text-red-600 transition-all duration-200 ease-in-out ${!error ? 'opacity-0' : ''}`}>
        {error ? error : ''}
      </div>
    </label>
  </div>
);

export default Input;
