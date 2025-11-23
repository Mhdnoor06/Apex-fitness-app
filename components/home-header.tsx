"use client";

import { useEffect, useState } from "react";

interface HomeHeaderProps {
  userName: string;
}

export function HomeHeader({ userName }: HomeHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Only run on client side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
  }, []);

  // Get greeting based on time
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // Get current date
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  const formattedDate = currentTime.toLocaleDateString('en-US', options);

  // Show placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <>
        <p className="text-slate-900 dark:text-white tracking-light text-[28px] font-bold leading-tight">
          Hello, {userName.split(' ')[0] || 'User'}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal pt-1">
          Loading...
        </p>
      </>
    );
  }

  return (
    <>
      <p className="text-slate-900 dark:text-white tracking-light text-[28px] font-bold leading-tight">
        {greeting}, {userName.split(' ')[0] || 'User'}
      </p>
      <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal pt-1">
        {formattedDate}
      </p>
    </>
  );
}
