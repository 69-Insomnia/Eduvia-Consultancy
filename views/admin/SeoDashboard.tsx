'use client';

import { FileText } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import AdminButton from '../../components/admin/AdminButton';
import SeoHealthPanel from '../../components/admin/SeoHealthPanel';

export default function SeoDashboard() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="SEO health"
        description="What needs attention across your published content and the site's own pages."
      >
        <AdminButton to="/admin/page-seo" variant="ghost" icon={FileText}>
          Page SEO
        </AdminButton>
      </PageHeader>

      <SeoHealthPanel />
    </div>
  );
}
