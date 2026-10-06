import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-dark-100">
        <Icon className="h-7 w-7 text-dark-400" aria-hidden="true" />
      </div>
      <h3 className="mb-1.5 font-display text-lg font-semibold text-dark-800">{title}</h3>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-dark-400">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
