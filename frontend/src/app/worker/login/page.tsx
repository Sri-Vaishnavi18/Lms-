'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3" />
      <p className="text-sm font-bold text-slate-600">Redirecting to LMS 360 Unified Login...</p>
    </div>
  );
}
