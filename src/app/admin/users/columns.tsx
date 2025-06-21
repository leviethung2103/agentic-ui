"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { User } from "@/types/user"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Icon from "@/components/ui/icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original
      const initials = user.username
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-brand/10 text-brand font-medium">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">{user.username}</p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge
          variant="secondary"
          className={
            role === "admin" ? "bg-brand/10 text-brand border-brand/20" : "bg-muted/20 text-muted border-muted/20"
          }
        >
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${status === "active" ? "bg-positive" : "bg-destructive"}`} />
          <span className="text-sm capitalize text-primary">{status}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => {
      const lastLogin = row.getValue("lastLogin") as string | null
      if (!lastLogin) {
        return <span className="text-xs text-muted">Never</span>
      }
      return <span className="text-xs text-muted">{formatDistanceToNow(new Date(lastLogin), { addSuffix: true })}</span>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      return <span className="text-xs text-muted">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-background-secondary">
              <span className="sr-only">Open menu</span>
              <Icon type="chevron-down" size="xs" className="rotate-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)} className="cursor-pointer">
              <Icon type="user" size="xs" className="mr-2" />
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Icon type="edit" size="xs" className="mr-2" />
              Edit user
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Icon type="refresh" size="xs" className="mr-2" />
              Reset password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <Icon type="trash" size="xs" className="mr-2" />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
