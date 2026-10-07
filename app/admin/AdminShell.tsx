'use client';

import { useLocation } from '../../utils/router';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import AdminLayout from '../../layouts/AdminLayout';

export default function AdminShell({ children }: { children?: React.ReactNode }) {
  const { pathname } = useLocation();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
