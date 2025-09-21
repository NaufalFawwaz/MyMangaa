export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';

  const variants = {
    primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white border border-[var(--color-primary)]',
    secondary: 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--bg-secondary)]',
    outline: 'border border-[var(--color-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer hover:shadow-sm active:translate-y-px';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}