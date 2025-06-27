"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { User } from '../../../types/user'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../../components/ui/avatar'
import Icon from '../../../components/ui/icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { formatDistanceToNow } from "date-fns"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip/tooltip"

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
        <TooltipProvider>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-background-secondary">
                  <span className="sr-only">Edit user</span>
                  <Icon type="edit" size="xs" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit user</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-background-secondary">
                  <span className="sr-only">Reset password</span>
                  <Icon type="refresh" size="xs" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset password</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-background-secondary hover:text-destructive">
                  <span className="sr-only">Delete user</span>
                  <Icon type="trash" size="xs" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete user</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )
    },
  },
]
