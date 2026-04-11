
'use client';

import { FinancialDashboard } from '@/components/reports/financial-dashboard';

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">Financial Reporting</h2>
        <p className="text-muted-foreground mt-1">Annual and monthly statements with smart AI insights.</p>
      </div>

      <FinancialDashboard />
    </div>
  );
}
