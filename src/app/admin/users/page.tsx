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
    return <div>Unauthorized access</div>
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
