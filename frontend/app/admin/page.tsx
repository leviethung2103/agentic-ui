'use client';

import AdminRoute from '../../components/auth/AdminRoute';

export default function AdminPage() {
  return (
    <AdminRoute>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
          <p className="mb-4">Welcome to the admin dashboard. Here you can manage application settings and users.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold mb-2">User Management</h3>
              <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold mb-2">System Settings</h3>
              <p className="text-sm text-gray-600">Configure application settings</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">View usage statistics</p>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
