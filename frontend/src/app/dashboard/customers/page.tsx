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
import { User } from "lucide-react"

export default function DashboardCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
        // Assuming GET /customers returns list
        const res = await apiClient.get("/customers")
        // Handle paginated response ({ docs: [], ... }) or plain array
        const data = res.data.docs || res.data; 
        setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error("Failed to fetch customers", error)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customer CRM</h2>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              {/* <TableHead>Total Bookings</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">Loading...</TableCell>
                </TableRow>
            ) : customers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">No customers found.</TableCell>
                </TableRow>
            ) : (
                customers.map((customer) => (
                    <TableRow key={customer.id}>
                        <TableCell className="font-medium flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            {customer.fullName}
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
