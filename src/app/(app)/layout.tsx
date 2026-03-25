'use client';
import { AuthGuard } from '@/components/AuthGuard';
import { StoreProvider } from '@/components/StoreProvider';
import { SideNav } from '@/components/SideNav';
import { AppNavBar } from '@/components/AppNavBar';
import { TopHeader } from '@/components/TopHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <StoreProvider>
        <div className="flex min-h-screen bg-background">
          <SideNav />
          <div className="flex-1 flex flex-col lg:ml-64 w-full">
            <TopHeader />
            <main className="flex-1 pb-24 lg:pb-12 w-full mx-auto px-4 lg:px-8 xl:px-12 pt-6 lg:pt-8 relative">
              {children}
            </main>
            <AppNavBar />
          </div>
        </div>
      </StoreProvider>
    </AuthGuard>
  );
}
