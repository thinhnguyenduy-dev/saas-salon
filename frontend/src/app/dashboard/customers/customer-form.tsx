"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateCustomer, useUpdateCustomer, MembershipTier } from "@/hooks/use-customers"
import { toast } from "sonner"
import { DialogFooter } from "@/components/ui/dialog"

const customerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be valid"),
  email: z.string().email().optional().or(z.literal('')),
  membershipTier: z.nativeEnum(MembershipTier),
  tags: z.string().optional(), // Comma separated for now
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerFormProps {
  initialData?: any
  onSuccess?: () => void
}

export function CustomerForm({ initialData, onSuccess }: CustomerFormProps) {
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      fullName: initialData?.fullName || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      membershipTier: initialData?.membershipTier || MembershipTier.BRONZE,
      tags: initialData?.tags ? initialData.tags.join(', ') : "",
    },
  })

  async function onSubmit(data: CustomerFormValues) {
    try {
      const formattedData = {
          ...data,
          tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
      };

      if (initialData) {
        await updateCustomer.mutateAsync({ id: initialData.id, data: formattedData })
        toast.success("Customer updated successfully")
      } else {
        await createCustomer.mutateAsync(formattedData)
        toast.success("Customer created successfully")
      }
      onSuccess?.()
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                    <Input placeholder="+1..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="membershipTier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership Tier</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                 <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(MembershipTier).map((tier) => (
                      <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                    <Input placeholder="VIP, New, Referral (comma separated)" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {initialData ? "Save Changes" : "Create Customer"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
