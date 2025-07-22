'use client';

import { ThemeProvider } from '@/misc_components/theme-provider';
import { AuthProvider } from '@/misc_components/auth-provider';
import { NotificationProvider } from '@/context/NotificationContext';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <SessionContextProvider supabaseClient={supabaseClient}>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </SessionContextProvider>
    </ThemeProvider>
  );
}
