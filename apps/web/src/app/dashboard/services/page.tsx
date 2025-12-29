'use client';

import { useServices } from '@/hooks/use-services';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ServiceForm } from './service-form';
import { useState } from 'react';

export default function ServicesPage() {
  const { data, isLoading } = useServices();
  const [open, setOpen] = useState(false);
  
  // Flatten data if it comes in paginated structure, or handle in hook.
  // Assuming hook returns { docs: [], ... }
  const services = data?.docs || [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">
            Manage your salon services and pricing.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Service</DialogTitle>
              <DialogDescription>
                Create a new service for your salon.
              </DialogDescription>
            </DialogHeader>
            <ServiceForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div>Loading services...</div>
      ) : (
        <DataTable columns={columns} data={services} />
      )}
    </div>
  );
}
