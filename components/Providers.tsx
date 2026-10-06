'use client';

import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { SettingsProvider } from '../context/SettingsContext';
import { PageSeoProvider } from '../context/PageSeoContext';

export default function Providers({ children }: { children?: React.ReactNode }) {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SettingsProvider>
          <PageSeoProvider>
            {children}
            <Toaster
              position="top-right"
              gutter={10}
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1b1f31',
                  color: '#f7f8fa',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  maxWidth: '380px',
                  boxShadow: '0 24px 48px -12px rgba(16, 19, 34, 0.35)',
                },
                success: {
                  iconTheme: { primary: '#16a34a', secondary: '#ffffff' },
                },
                error: {
                  iconTheme: { primary: '#de1f26', secondary: '#ffffff' },
                },
              }}
            />
          </PageSeoProvider>
        </SettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
