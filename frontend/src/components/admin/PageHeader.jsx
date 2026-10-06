/**
 * Title plus optional description and right-aligned actions, for the top of an
 * admin screen. The layout `AdminLayout` header shows the section name; this is
 * for the screen's own heading and its primary action.
 */
export default function PageHeader({ title, description, children }) {
  if (!title && !children) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {title && (
          <h2 className="font-display text-base font-semibold text-dark-900">{title}</h2>
        )}
        {description && <p className="mt-0.5 text-sm text-dark-500">{description}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}
