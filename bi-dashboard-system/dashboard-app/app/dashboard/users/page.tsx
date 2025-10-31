// dashboard-app/app/dashboard/users/page.tsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { UserPlus, Search, Filter } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user is admin
  if (!isAdmin(session.user.roles)) {
    redirect('/dashboard');
  }

  // Fetch users
  const users = await prisma.user.findMany({
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const pendingUsers = users.filter(u => u.status === 'pending');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'success',
      pending: 'warning',
      inactive: 'default',
      suspended: 'danger',
    };
    return variants[status] || 'default';
  };

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-accent-900">User Management</h1>
            <p className="text-accent-600 mt-1">Manage users and their access permissions</p>
          </div>
          <Button className="sm:w-auto w-full">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>

        {/* Pending Approvals Alert */}
        {pendingUsers.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-yellow-900">
                    {pendingUsers.length} user{pendingUsers.length > 1 ? 's' : ''} pending approval
                  </p>
                  <p className="text-sm text-yellow-700">
                    Review and approve new user registrations
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Review
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-accent-900">All Users ({users.length})</h3>
          </CardHeader>
          <CardBody className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-accent-900">{user.fullName}</p>
                          <p className="text-sm text-accent-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-accent-700">{user.email}</TableCell>
                    <TableCell>
                      {user.roles.length > 0 ? (
                        <Badge size="sm">{user.roles[0].role.name}</Badge>
                      ) : (
                        <Badge variant="default" size="sm">No Role</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(user.status)} size="sm">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-accent-600">
                      {user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        {user.status === 'pending' && (
                          <Button variant="primary" size="sm">Approve</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}