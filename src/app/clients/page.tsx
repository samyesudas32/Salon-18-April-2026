'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllClientsList } from '@/components/clients/all-clients-list';
import { RegularClientsList } from '@/components/clients/regular-clients-list';
import { ClientHistory } from '@/components/clients/client-history';
import { List, Star, Users } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">Client Management</h2>
        <p className="text-muted-foreground mt-1">View client lists, regulars, and detailed work history.</p>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all">
            <List className="h-4 w-4 mr-2" />
            All Clients
          </TabsTrigger>
          <TabsTrigger value="regulars">
            <Star className="h-4 w-4 mr-2" />
            Regulars
          </TabsTrigger>
          <TabsTrigger value="history">
            <Users className="h-4 w-4 mr-2" />
            Client History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <AllClientsList />
        </TabsContent>
        <TabsContent value="regulars" className="mt-6">
          <RegularClientsList />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <ClientHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
