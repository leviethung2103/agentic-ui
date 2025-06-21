'use client'

import { useAdminAccess } from '@/hooks/useAdminAccess'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { User } from '@/types/user'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AdminUsersPage() {
  const { isAdmin } = useAdminAccess()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (isAdmin) {
      fetch('/api/admin/users')
        .then(res => res.json())
        .then(data => setUsers(data))
    }
  }, [isAdmin])

  console.log("is admin", isAdmin)
  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full bg-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-10"></div>
        <div className="relative flex min-h-screen w-full items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-background-secondary p-8 shadow-2xl backdrop-blur-sm border border-border">
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
                <p className="text-muted-foreground">
                  You don't have permission to view this page. Please contact an administrator if you believe this is an error.
                </p>
              </div>
              <Button
                onClick={() => window.location.href = '/'}
                className="w-full text-white"
                style={{ backgroundColor: '#FF4017' }}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  )
}
