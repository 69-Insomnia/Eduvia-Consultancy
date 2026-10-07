import type { Metadata } from 'next';
import AdminShell from './AdminShell';

/**
 * The admin section keeps the shell it always had (the layout used to be the
 * client component itself), but the metadata has to be declared from a server
 * component — no other route under /admin can set it either. `noindex` here
 * covers the whole section, including /admin/login, which used to ask the
 * Helmet-based <SEO> for it and never reached the document head.
 */
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children?: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
