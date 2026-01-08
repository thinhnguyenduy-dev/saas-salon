"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useStaff, useDeleteStaff, Staff } from "@/hooks/use-staff"
import { StaffForm } from "./staff-form"
import { Badge } from "@/components/ui/badge"

export default function DashboardStaffPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useStaff(page, 10) // Limit 10
  const deleteStaff = useDeleteStaff()
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaff.mutateAsync(id)
        toast.success("Staff deleted successfully")
      } catch (error) {
        toast.error("Failed to delete staff")
      }
    }
  }

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff)
    setDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingStaff(null)
    setDialogOpen(true)
  }

  const onFormSuccess = () => {
    setDialogOpen(false)
    setEditingStaff(null) // Reset editing state
  }

  const staffList = data?.docs || []

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) setEditingStaff(null)
        }}>
            <DialogTrigger asChild>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" /> Add Staff
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingStaff ? "Edit Staff" : "Add New Staff"}</DialogTitle>
                </DialogHeader>
                <StaffForm initialData={editingStaff} onSuccess={onFormSuccess} />
            </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Internal Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow>
                 <TableCell colSpan={5} className="text-center h-24">Loading...</TableCell>
               </TableRow>
            ) : staffList.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={5} className="text-center h-24">No staff found.</TableCell>
               </TableRow>
            ) : (
                staffList.map((employee: any) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.fullName}</TableCell>
                    <TableCell>{employee.email || '-'}</TableCell>
                    <TableCell>{employee.phone || '-'}</TableCell>
                    <TableCell>
                        <Badge variant={employee.isActive ? "default" : "secondary"}>
                            {employee.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="sm" onClick={() => handleEdit(employee)}>
                            <Pencil className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(employee.id)}>
                            <Trash className="h-4 w-4" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Simple pagination controls if needed, relying on default for now */}
    </div>
  )
}
