'use client';

import { useStaff, useDeleteStaff, Staff } from '@/hooks/use-staff';
import { createColumns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { StaffForm } from './staff-form';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function StaffPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { data, isLoading } = useStaff(1, 50, debouncedSearch);
  const deleteStaff = useDeleteStaff();
  
  const [open, setOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);

  // Debounce search
  const handleSearch = (value: string) => {
    setSearch(value);
    const timeout = setTimeout(() => setDebouncedSearch(value), 300);
    return () => clearTimeout(timeout);
  };

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingStaff) return;
    try {
      await deleteStaff.mutateAsync(deletingStaff._id);
      toast.success('Staff deleted successfully');
      setDeletingStaff(null);
    } catch (error) {
      toast.error('Failed to delete staff');
    }
  };

  const handleFormSuccess = () => {
    setOpen(false);
    setEditingStaff(null);
  };

  const columns = useMemo(() => createColumns({
    onEdit: handleEdit,
    onDelete: setDeletingStaff,
  }), []);

  const staffList = data?.docs || [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Staff</h2>
          <p className="text-muted-foreground">
            Manage your team members and their schedules.
          </p>
        </div>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setEditingStaff(null);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStaff ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
              <DialogDescription>
                {editingStaff ? 'Update staff member details.' : 'Add a new team member to your salon.'}
              </DialogDescription>
            </DialogHeader>
            <StaffForm 
              initialData={editingStaff} 
              onSuccess={handleFormSuccess} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading staff...</div>
        </div>
      ) : (
        <DataTable columns={columns} data={staffList} />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingStaff} onOpenChange={(open: boolean) => !open && setDeletingStaff(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingStaff?.fullName}</strong>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
