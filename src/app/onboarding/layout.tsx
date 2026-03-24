import { StoreProvider } from '@/components/StoreProvider';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  );
}
