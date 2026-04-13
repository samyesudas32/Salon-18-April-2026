
import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { AppProvider } from '@/app/lib/store';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { PhotoUpload } from '@/components/layout/photo-upload';
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <AppProvider>
            <SidebarProvider>
              <div className="flex min-h-screen w-full bg-background">
                <SidebarNav />
                <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                  <header className="grid grid-cols-3 h-32 items-center border-b border-border/40 bg-card/50 backdrop-blur-md px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4 justify-start">
                      <SidebarTrigger className="-ml-1" />
                    </div>
                    <div className="flex justify-center items-center">
                      <div className="hidden md:flex">
                        <PhotoUpload />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 justify-end">
                      <AdminProfileHeader />
                    </div>
                  </header>
                  <main className="flex-1 overflow-y-auto p-6 md:p-8">
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
