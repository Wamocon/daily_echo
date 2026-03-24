'use client';
import { AuthGuard } from '@/components/AuthGuard';
import { StoreProvider } from '@/components/StoreProvider';
import { SideNav } from '@/components/SideNav';
import { AppNavBar } from '@/components/AppNavBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <StoreProvider>
        <div className="flex min-h-screen">
          <SideNav />
          <div className="flex-1 flex flex-col lg:ml-64">
            <main className="flex-1 pb-24 lg:pb-8">{children}</main>
            <AppNavBar />
          </div>
        </div>
      </StoreProvider>
    </AuthGuard>
  );
}
