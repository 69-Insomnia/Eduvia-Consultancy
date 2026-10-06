import { Link } from 'react-router-dom';

/**
 * The admin's button. Replaces the PRIMARY_BTN / DANGER_BTN / GHOST_BTN string
 * constants that every admin page used to declare for itself.
 *
 * Renders a <Link> when `to` is given so router navigation keeps working.
 */

const VARIANTS = {
  primary:
    'bg-primary-500 text-white shadow-xs hover:bg-primary-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
  danger:
    'bg-accent-500 text-white shadow-xs hover:bg-accent-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
  ghost:
    'border border-dark-200 bg-white text-dark-700 shadow-xs hover:bg-dark-50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
  subtle:
    'bg-dark-100 text-dark-700 hover:bg-dark-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
};

const SIZES = {
  // 44px tall: the comfortable touch target the rest of the admin already uses.
  md: 'px-4 py-2.5 text-sm',
  sm: 'px-3 py-2 text-xs',
};

// Square icon-only button, used in table action columns.
const ICON_SIZES = {
  md: 'h-10 w-10',
  sm: 'h-9 w-9',
};

export default function AdminButton({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconOnly = false,
  to,
  className = '',
  type = 'button',
  ...rest
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all',
    iconOnly ? ICON_SIZES[size] : SIZES[size],
    VARIANTS[variant] || VARIANTS.primary,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {Icon && <Icon className={iconOnly ? 'h-4 w-4' : 'h-4 w-4'} aria-hidden="true" />}
      {!iconOnly && children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}

/**
 * Row-action button for table action columns. `label` becomes the accessible
 * name, since the button has no visible text.
 */
export function RowAction({ icon: Icon, label, tone = 'primary', className = '', ...rest }) {
  const tones = {
    primary: 'text-dark-400 hover:text-primary-500 hover:bg-primary-50',
    danger: 'text-dark-400 hover:text-accent-500 hover:bg-accent-50',
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${tones[tone]} ${className}`}
      {...rest}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
