import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { AppProvider } from '@/app/lib/store';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { HeaderImage } from '@/components/layout/header-image';
import { AdminProfileHeader } from '@/components/layout/admin-profile-header';

export const metadata: Metadata = {
  title: 'ServiceFlow Hub',
  description: 'Manage your service business bookings and finances with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <AppProvider>
            <SidebarProvider>
              <div className="flex min-h-screen w-full bg-background overflow-hidden">
                <SidebarNav />
                <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                  <header className="flex h-16 md:h-[120px] items-center border-b border-border/40 bg-card/50 backdrop-blur-md px-4 md:px-6 sticky top-0 z-30 justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                      <SidebarTrigger className="-ml-1" />
                    </div>
                    <div className="hidden md:flex flex-1 justify-center px-4 max-w-full overflow-hidden">
                      <HeaderImage />
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                      <AdminProfileHeader />
                    </div>
                  </header>
                  <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
            <Toaster />
          </AppProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
