import { redirect } from 'next/navigation';

// The SPA's `*` route sent unknown paths to the homepage — keep that behaviour.
export default function CatchAll() {
  redirect('/');
}
