"use client"

import { useEffect, useState } from "react"
import apiClient from "@/lib/api-client"
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
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function DashboardStaffPage() {
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      // Assuming GET /staff/shop/:shopId or similar. 
      // For now, simpler implementation: fetching all staff for the logged-in user's shop
      // The backend endpoint might need adjustment if not already filtering by current user's shop properly.
      // Based on previous work, GET /staff usually returns list.
      const res = await apiClient.get("/staff")
      const data = res.data.docs || res.data;
      setStaff(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch staff", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.post("/staff", formData)
      toast.success("Staff member created")
      setDialogOpen(false)
      fetchStaff()
      setFormData({ fullName: "", email: "", phone: "" })
    } catch (error) {
      console.error(error)
      toast.error("Failed to create staff")
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Staff
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Staff</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                            id="fullName" 
                            value={formData.fullName} 
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email"
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                            id="phone" 
                            value={formData.phone} 
                            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                            required
                        />
                    </div>
                    {/* Password is hidden/default for now to simplify */}
                    <DialogFooter>
                        <Button type="submit">Create Staff</Button>
                    </DialogFooter>
                </form>
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
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow>
                 <TableCell colSpan={5} className="text-center h-24">Loading...</TableCell>
               </TableRow>
            ) : staff.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={5} className="text-center h-24">No staff found.</TableCell>
               </TableRow>
            ) : (
                staff.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.fullName}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.isActive ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                       <Button variant="ghost" size="sm" className="text-destructive"><Trash className="h-4 w-4" /></Button>
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
