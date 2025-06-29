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
import { toast } from 'sonner'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../../components/ui/dialog"

export const columns = (
  onUserDeleted: (id: string) => void,
  onUserUpdated: (user: User) => void
): ColumnDef<User>[] => [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }: { row: any }) => {
        const user: User = row.original
        const initials = user.username
          .split(" ")
          .map((name: string) => name[0])
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
      cell: ({ row }: { row: any }) => {
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
      cell: ({ row }: { row: any }) => {
        const createdAt = row.getValue("createdAt") as string
        return <span className="text-xs text-muted">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        const user: User = row.original
        const [showEdit, setShowEdit] = useState(false)
        const [editRole, setEditRole] = useState<"user" | "admin">(user.role)
        const [editLoading, setEditLoading] = useState(false)
        const [deleteLoading, setDeleteLoading] = useState(false)

        const handleDelete = async () => {
          if (user.role === 'admin') {
            toast.error('You do not have permission to delete admin users.')
            return
          }
          setDeleteLoading(true)
          try {
            const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
            const data = await res.json()
            if (!res.ok) {
              toast.error(data.error || 'Failed to delete user')
            } else {
              toast.success('User deleted successfully')
              onUserDeleted(user.id)
            }
          } catch (err) {
            toast.error('Failed to delete user')
          } finally {
            setDeleteLoading(false)
          }
        }

        const handleEdit = async () => {
          setEditLoading(true)
          try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ role: editRole }),
            })
            const data = await res.json()
            if (!res.ok) {
              toast.error(data.error || 'Failed to update user')
            } else {
              toast.success('User role updated')
              onUserUpdated(data)
              setShowEdit(false)
            }
          } catch (err) {
            toast.error('Failed to update user')
          } finally {
            setEditLoading(false)
          }
        }

        return (
          <TooltipProvider>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-background-secondary" onClick={() => setShowEdit(true)}>
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
                  <Button variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-background-secondary hover:text-destructive" onClick={handleDelete} disabled={deleteLoading}>
                    <span className="sr-only">Delete user</span>
                    <Icon type="trash" size="xs" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete user</p>
                </TooltipContent>
              </Tooltip>
              {showEdit && (
                <Dialog open={showEdit} onOpenChange={setShowEdit}>
                  <div className="p-4">
                    <h2 className="font-bold mb-2">Edit User Role</h2>
                    <select value={editRole} onChange={e => setEditRole(e.target.value as 'user' | 'admin')} className="border rounded px-2 py-1">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleEdit} disabled={editLoading} className="bg-brand text-white">Save</Button>
                      <Button variant="ghost" onClick={() => setShowEdit(false)}>Cancel</Button>
                    </div>
                  </div>
                </Dialog>
              )}
            </div>
          </TooltipProvider>
        )
      },
    },
  ]
