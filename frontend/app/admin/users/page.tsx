"use client"

import { useSession } from 'next-auth/react'
import { DataTable } from '../../../components/ui/data-table'
import { columns as userColumns } from "./columns"
import type { User } from '../../../types/user'
import { useEffect, useState } from "react"
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import Icon from '../../../components/ui/icon'
import { Skeleton } from '../../../components/ui/skeleton'
import { motion } from "framer-motion"
import { Dialog } from '../../../components/ui/dialog'

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const isClient = typeof window !== 'undefined';
  const isAuthLoading = status === 'loading';
  const isAdmin = session?.user?.role === 'admin';
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all")
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [addUserError, setAddUserError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      // Simulate API call with loading state
      setIsLoading(true)
      setTimeout(() => {
        fetch("/api/admin/users")
          .then((res) => res.json())
          .then((data) => {
            setUsers(data)
            setFilteredUsers(data)
            setIsLoading(false)
          })
      }, 1000)
    }
  }, [isAdmin])

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchQuery, roleFilter])

  // Calculate paginated users
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  // Reset to page 1 if filters/search change and page is out of range
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filteredUsers, page, totalPages]);

  function handleAddUserChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setAddUserForm({ ...addUserForm, [e.target.name]: e.target.value });
  }

  function handleAddUserRoleChange(value: string) {
    setAddUserForm({ ...addUserForm, role: value });
  }

  async function handleAddUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAddUserError('');
    if (!addUserForm.username || !addUserForm.email || !addUserForm.password) {
      setAddUserError('All fields are required.');
      return;
    }
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addUserForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddUserError(data.error || 'Failed to add user.');
        return;
      }
      setUsers([data, ...users]);
      setShowAddUser(false);
      setAddUserForm({ username: '', email: '', password: '', role: 'user' });
    } catch (err) {
      setAddUserError('Failed to add user.');
    }
  }

  // Handler to remove user from state after delete
  function handleUserDeleted(id: string) {
    setUsers((prev) => {
      const newUsers = prev.filter((u) => u.id !== id)
      // Re-filter after delete
      let filtered = newUsers
      if (searchQuery.trim()) {
        filtered = filtered.filter(
          (user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }
      if (roleFilter !== "all") {
        filtered = filtered.filter((user) => user.role === roleFilter)
      }
      setFilteredUsers(filtered)
      return newUsers
    })
  }

  // Handler to update user in state after edit
  function handleUserUpdated(updatedUser: User) {
    setUsers((prev) => {
      const newUsers = prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      // Re-filter after edit
      let filtered = newUsers
      if (searchQuery.trim()) {
        filtered = filtered.filter(
          (user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }
      if (roleFilter !== "all") {
        filtered = filtered.filter((user) => user.role === roleFilter)
      }
      setFilteredUsers(filtered)
      return newUsers
    })
  }

  // Show loading state while checking auth or not on client yet
  if (!isClient || isAuthLoading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full bg-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-10"></div>
        <div className="relative flex min-h-screen w-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl bg-background-secondary p-8 shadow-2xl backdrop-blur-sm border border-border"
          >
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <Icon type="x" size="lg" className="text-destructive" />
                </div>
                <h1 className="text-2xl font-bold text-primary">Access Denied</h1>
                <p className="text-muted">
                  You don't have permission to view this page. Please contact an administrator if you believe this is an
                  error.
                </p>
              </div>
              <Button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-brand text-white hover:bg-brand/90"
              >
                Return to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-primary">User Management</h1>
            <p className="text-muted">Manage user accounts and permissions</p>
          </div>
          <Button className="bg-brand text-white hover:bg-brand/90" onClick={() => setShowAddUser(true)}>
            <Icon type="plus-icon" size="xs" className="mr-2" />
            Add User
          </Button>
        </motion.div>

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background-secondary rounded-lg shadow-lg p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New User</h2>
              <form onSubmit={handleAddUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <Input name="username" value={addUserForm.username} onChange={handleAddUserChange} autoFocus />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input name="email" type="email" value={addUserForm.email} onChange={handleAddUserChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <Input name="password" type="password" value={addUserForm.password} onChange={handleAddUserChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <Select name="role" value={addUserForm.role} onValueChange={handleAddUserRoleChange}>
                    <SelectTrigger className="w-full bg-[#111113] focus:ring-0 focus:border-none border-none shadow-none">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {addUserError && <div className="text-destructive text-sm">{addUserError}</div>}
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setShowAddUser(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand text-white hover:bg-brand/90">
                    Add
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <Card className="border-border bg-background-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted">Total Users</CardTitle>
              <Icon type="user" size="xs" className="text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {isLoading ? <Skeleton className="h-8 w-16" /> : users.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-background-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted">Admins</CardTitle>
              <Badge variant="secondary" className="bg-brand/10 text-brand">
                Admin
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {isLoading ? <Skeleton className="h-8 w-16" /> : users.filter((u) => u.role === "admin").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-background-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted">Regular Users</CardTitle>
              <Badge variant="secondary" className="bg-muted/20 text-muted">
                User
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {isLoading ? <Skeleton className="h-8 w-16" /> : users.filter((u) => u.role === "user").length}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Icon type="search" size="xs" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-border bg-background-secondary"
            />
          </div>
          <Select value={roleFilter} onValueChange={(value: "all" | "admin" | "user") => setRoleFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px] border-border bg-background-secondary">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <p className="text-sm text-muted">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
              }}
              className="text-muted hover:text-primary"
            >
              Clear search
            </Button>
          )}
        </motion.div>

        {/* Data Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border bg-background-secondary">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <DataTable columns={userColumns(handleUserDeleted, handleUserUpdated)} data={paginatedUsers} />
                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-background-secondary">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted">Rows per page:</span>
                      <select
                        className="border rounded px-2 py-1 text-sm bg-background-secondary"
                        value={pageSize}
                        onChange={e => {
                          setPageSize(Number(e.target.value));
                          setPage(1);
                        }}
                      >
                        {[5, 10, 20, 50].map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 py-1 rounded border text-sm disabled:opacity-50"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Prev
                      </button>
                      <span className="text-sm text-muted">
                        Page {page} of {totalPages || 1}
                      </span>
                      <button
                        className="px-2 py-1 rounded border text-sm disabled:opacity-50"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages || totalPages === 0}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
