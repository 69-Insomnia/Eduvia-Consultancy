/**
 * Labelled form control for the admin. Collapses the repeated
 * `<label className="block text-sm …">` + input markup that every admin form
 * spelled out by hand.
 *
 * Renders an input, textarea or select based on `as`, and passes everything else
 * through to the control.
 */

export const INPUT_CLASS =
  'w-full rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-sm text-dark-900 shadow-xs transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 disabled:bg-dark-50 disabled:text-dark-400';

const LABEL_CLASS = 'block text-sm font-medium text-dark-700 mb-1.5';

export default function FormField({
  label,
  as = 'input',
  options = [],
  hint,
  error,
  required = false,
  className = '',
  controlClassName = '',
  id,
  children,
  ...rest
}) {
  const controlId = id || (label ? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : undefined);
  const describedBy = hint || error ? `${controlId}-help` : undefined;

  const controlProps = {
    id: controlId,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    className: `${INPUT_CLASS} ${as === 'textarea' ? 'resize-none' : ''} ${error ? 'border-accent-400 focus:border-accent-500 focus:ring-accent-500/10' : ''} ${controlClassName}`,
    ...rest,
  };

  let control;
  if (as === 'textarea') {
    control = <textarea {...controlProps} />;
  } else if (as === 'select') {
    control = (
      <select {...controlProps}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
    );
  } else {
    control = <input {...controlProps} />;
  }

  return (
    <div className={className}>
      {label && (
        <label htmlFor={controlId} className={LABEL_CLASS}>
          {label}
          {required && <span className="ml-0.5 text-accent-500" aria-hidden="true">*</span>}
        </label>
      )}
      {control}
      {(hint || error) && (
        <p
          id={`${controlId}-help`}
          className={`mt-1.5 text-xs ${error ? 'text-accent-600' : 'text-dark-400'}`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

/** Checkbox with an inline label, the shape most admin forms use. */
export function CheckboxField({ label, checked, onChange, className = '', ...rest }) {
  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        checked={checked ?? false}
        onChange={onChange}
        className="h-4 w-4 rounded text-primary-500 focus:ring-primary-500"
        {...rest}
      />
      <span className="text-sm font-medium text-dark-700">{label}</span>
    </label>
  );
}
