'use client';

const Button = ({
  onClick = () => {},
  children = '',
  type = 'button',
  disabled = false,
  className = '',
}: {
  /** The function to call when the button is clicked. */
  onClick?: () => void;
  /** The content of the button. */
  children?: React.ReactNode;
  /** The type of the button. */
  type?: 'submit' | 'reset' | 'button';
  /** Whether the button is disabled or not. */
  disabled?: boolean;
  /** An optional class name for the button. */
  className?: string;
}) => {
  return (
    <button
      type={type}
      className={`${className} px-6 py-3 bg-primary rounded-xl text-white font-bold text-2xl uppercase transition-all duration-200 ease-in-out hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
