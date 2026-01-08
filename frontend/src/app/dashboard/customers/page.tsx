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
import { User, Plus, Pencil, Trash } from "lucide-react"
import { useCustomers, useDeleteCustomer, Customer } from "@/hooks/use-customers"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { CustomerForm } from "./customer-form"
import { toast } from "sonner"

export default function DashboardCustomersPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useCustomers(page, 10)
  const deleteCustomer = useDeleteCustomer()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
        try {
            await deleteCustomer.mutateAsync(id)
            toast.success("Customer deleted successfully")
        } catch (error) {
            toast.error("Failed to delete customer")
        }
    }
  }

  const handleEdit = (customer: Customer) => {
      setEditingCustomer(customer)
      setDialogOpen(true)
  }

  const handleAddNew = () => {
      setEditingCustomer(null)
      setDialogOpen(true)
  }

  const onFormSuccess = () => {
      setDialogOpen(false)
      setEditingCustomer(null)
  }

  const customers = data?.docs || []

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customer CRM</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) setEditingCustomer(null)
        }}>
            <DialogTrigger asChild>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" /> Add Customer
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{editingCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
                </DialogHeader>
                <CustomerForm initialData={editingCustomer} onSuccess={onFormSuccess} />
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">Loading...</TableCell>
                </TableRow>
            ) : customers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No customers found.</TableCell>
                </TableRow>
            ) : (
                customers.map((customer: any) => (
                    <TableRow key={customer.id}>
                        <TableCell className="font-medium flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            {customer.fullName}
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm" onClick={() => handleEdit(customer)}>
                                <Pencil className="h-4 w-4" />
                           </Button>
                           <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(customer.id)}>
                                <Trash className="h-4 w-4" />
                           </Button>
                        </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
