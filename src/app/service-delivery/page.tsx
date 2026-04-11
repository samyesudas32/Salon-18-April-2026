'use client';

import { ServiceTab } from '@/components/clients/service-tab';

export default function ServiceDeliveryPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">Service Delivery Records</h2>
        <p className="text-muted-foreground mt-1">Manage technical delivery details independently from bookings.</p>
      </div>

      <ServiceTab />
    </div>
  );
}
