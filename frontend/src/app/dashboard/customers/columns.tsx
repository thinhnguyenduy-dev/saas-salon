"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Customer, MembershipTier } from "@/hooks/use-customers"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Need to install date-fns later if complex formatting is needed, using native for now
const formatDate = (dateString?: string | Date) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

export const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }: { table: any }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: { row: any }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: ({ column }: { column: any }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: { row: any }) => row.getValue("email") || "N/A",
  },
  {
    accessorKey: "membershipTier",
    header: "Tier",
    cell: ({ row }: { row: any }) => {
       const tier = row.getValue("membershipTier") as MembershipTier;
       const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
         [MembershipTier.BRONZE]: "secondary",
         [MembershipTier.SILVER]: "outline",
         [MembershipTier.GOLD]: "default",
         [MembershipTier.PLATINUM]: "destructive", // Just for distinction
       };
       return (
         <Badge variant={colors[tier] || "outline"}>
           {tier}
         </Badge>
       )
    }
  },
  {
    accessorKey: "loyaltyPoints",
    header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Points
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }: { row: any }) => <div className="text-center">{row.getValue("loyaltyPoints")}</div>,
  },
  {
    accessorKey: "stats.lastVisit",
    header: "Last Visit",
    cell: ({ row }: { row: any }) => {
        // Access nested data safely if possible, React Table handles dot notation usually
        const stats = row.original.stats;
        return <div>{formatDate(stats?.lastVisit)}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }: { row: any }) => {
      const customer = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(customer.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Profile (WIP)</DropdownMenuItem>
            <DropdownMenuItem>Edit Customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
