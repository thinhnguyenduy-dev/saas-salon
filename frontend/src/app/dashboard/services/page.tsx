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
import { useServices, useDeleteService, Service } from "@/hooks/use-services"
import { ServiceForm } from "./service-form"
import { Badge } from "@/components/ui/badge"

export default function DashboardServicesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useServices(page, 10)
  const deleteService = useDeleteService()
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService.mutateAsync(id)
        toast.success("Service deleted successfully")
      } catch (error) {
        toast.error("Failed to delete service")
      }
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingService(null)
    setDialogOpen(true)
  }

  const onFormSuccess = () => {
    setDialogOpen(false)
    setEditingService(null) // Reset editing state
  }

  const services = data?.docs || []

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Services Management</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) setEditingService(null)
        }}>
            <DialogTrigger asChild>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                </DialogHeader>
                <ServiceForm initialData={editingService} onSuccess={onFormSuccess} />
            </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration (min)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">Loading...</TableCell>
                </TableRow>
            ) : services.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No services found.</TableCell>
                </TableRow>
            ) : (
                services.map((service: any) => (
                    <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>{service.description}</TableCell>
                        <TableCell>${service.price}</TableCell>
                        <TableCell>{service.duration}</TableCell>
                        <TableCell>
                            <Badge variant={service.isActive ? "default" : "secondary"}>
                                {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(service.id)}>
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
