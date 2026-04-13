
'use client';

import { useApp } from '@/app/lib/store';

export function AdminProfileHeader() {
  const { adminName } = useApp();
  
  return (
    <div className="text-xs text-right hidden sm:block">
      <p className="font-bold text-primary">Administrator</p>
      <p className="text-muted-foreground">{adminName}</p>
    </div>
  );
}
