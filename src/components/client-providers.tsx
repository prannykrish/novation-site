'use client';

import { ThemeProvider } from '@/misc_components/theme-provider';
import { AuthProvider } from '@/misc_components/auth-provider';
//import { NotificationProvider } from '@/context/NotificationContext';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <AuthProvider>
        {children}
        {/* <NotificationProvider>
          {children}
        </NotificationProvider> */}
      </AuthProvider>
    </ThemeProvider>
  );
}
