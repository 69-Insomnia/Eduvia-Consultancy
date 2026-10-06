import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { PageSeoProvider } from './context/PageSeoContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      {/* Opt into the v7 behaviours now: silences the deprecation warnings and,
          because startTransition keeps the current screen mounted, stops lazy
          route changes from flashing the full-screen loading spinner. */}
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <SettingsProvider>
            <PageSeoProvider>
              <App />
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
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
