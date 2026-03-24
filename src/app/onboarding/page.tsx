'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { OnboardingFlow, OnboardingData } from '@/components/OnboardingFlow';

export default function OnboardingPage() {
  const router = useRouter();
  const { saveOnboardingProfile } = useAppStore();

  const handleComplete = (data: OnboardingData) => {
    saveOnboardingProfile(data);
    // Brief delay so the done-screen animation plays
    setTimeout(() => router.push('/home'), 1800);
  };

  return <OnboardingFlow onComplete={handleComplete} />;
}
