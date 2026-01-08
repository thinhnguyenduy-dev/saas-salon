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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DashboardServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 30, // Default 30 min
    categoryId: ""
  })

  useEffect(() => {
    fetchServices()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
      try {
          const res = await apiClient.get('/categories');
          const data = res.data.docs || res.data;
          setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
          console.error("Failed to fetch categories", error);
          setCategories([]);
      }
  }

  const fetchServices = async () => {
    try {
      const res = await apiClient.get("/services")
      const data = res.data.docs || res.data;
      setServices(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch services", error)
    } finally {
        setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.post("/services", formData)
      toast.success("Service created")
      setDialogOpen(false)
      fetchServices()
      setFormData({ name: "", description: "", price: 0, duration: 30, categoryId: "" })
    } catch (error) {
       console.error(error)
       toast.error("Failed to create service")
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Services Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Service</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Service Name</Label>
                        <Input 
                            id="name" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => setFormData({...formData, categoryId: value})} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                            id="description" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        />
                    </div>
                    <div className="grid gap-4 grid-cols-2">
                         <div className="grid gap-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input 
                                id="price" 
                                type="number"
                                min="0"
                                value={formData.price} 
                                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="duration">Duration (min)</Label>
                            <Input 
                                id="duration" 
                                type="number"
                                min="5"
                                step="5"
                                value={formData.duration} 
                                onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})} 
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Service</Button>
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
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration (min)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">Loading...</TableCell>
                </TableRow>
            ) : services.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No services found.</TableCell>
                </TableRow>
            ) : (
                services.map((service) => (
                    <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>{service.description}</TableCell>
                        <TableCell>${service.price}</TableCell>
                        <TableCell>{service.duration}</TableCell>
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
