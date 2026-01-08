"use client"

import { useForm, useFieldArray } from "react-hook-form"
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
import { useCreateStaff, useUpdateStaff, Staff } from "@/hooks/use-staff"
import { toast } from "sonner"
import { DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const workShiftSchema = z.object({
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
})

const staffSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  skills: z.string().optional(), // Comma-separated, will be split
  baseSalary: z.coerce.number().min(0).default(0),
  commissionRate: z.coerce.number().min(0).max(100).default(0),
  isActive: z.boolean().default(true),
  workSchedule: z.array(workShiftSchema).default([]),
})

type StaffFormValues = z.infer<typeof staffSchema>

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]

interface StaffFormProps {
  initialData?: Staff | null
  onSuccess?: () => void
}

export function StaffForm({ initialData, onSuccess }: StaffFormProps) {
  const createStaff = useCreateStaff()
  const updateStaff = useUpdateStaff()

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema) as any,
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      skills: initialData?.skills?.join(", ") || "",
      baseSalary: initialData?.baseSalary || 0,
      commissionRate: initialData?.commissionRate || 0,
      isActive: initialData?.isActive ?? true,
      workSchedule: initialData?.workSchedule || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workSchedule",
  })

  async function onSubmit(data: StaffFormValues) {
    try {
      // Transform skills from comma-separated string to array
      const payload = {
        ...data,
        email: data.email || undefined,
        skills: data.skills 
          ? data.skills.split(",").map(s => s.trim()).filter(Boolean)
          : [],
      }

      if (initialData) {
        await updateStaff.mutateAsync({ id: initialData.id, data: payload })
        toast.success("Staff updated successfully")
      } else {
        await createStaff.mutateAsync(payload)
        toast.success("Staff created successfully")
      }
      onSuccess?.()
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <Input placeholder="Haircut, Coloring, Styling (comma-separated)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="baseSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Salary ($)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={100} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Staff member is available for bookings
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Work Schedule */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Work Schedule</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" })}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Shift
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No work shifts configured. Click "Add Shift" to define working hours.
              </p>
            ) : (
              fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`workSchedule.${index}.dayOfWeek`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select 
                          onValueChange={(v) => field.onChange(parseInt(v))} 
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DAYS_OF_WEEK.map(day => (
                              <SelectItem key={day.value} value={day.value.toString()}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`workSchedule.${index}.startTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="time" className="w-28" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span className="text-muted-foreground">to</span>
                  <FormField
                    control={form.control}
                    name={`workSchedule.${index}.endTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="time" className="w-28" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {initialData ? "Save Changes" : "Add Staff"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
