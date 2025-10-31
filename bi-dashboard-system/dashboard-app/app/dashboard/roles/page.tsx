// dashboard-app/app/dashboard/roles/page.tsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Shield, Plus, Edit, Trash2, Users, Lock } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';

export default async function RolesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user is admin
  if (!isAdmin(session.user.roles)) {
    redirect('/dashboard');
  }

  // Fetch roles and permissions
  const [roles, permissions] = await Promise.all([
    prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    }),
    prisma.permission.findMany({
      orderBy: {
        resource: 'asc',
      },
    }),
  ]);

  // Group permissions by resource
  const permissionsByResource = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = [];
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-accent-900">Roles & Permissions</h1>
            <p className="text-accent-600 mt-1">Manage user roles and access permissions</p>
          </div>
          <Button className="sm:w-auto w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Total Roles</p>
                  <p className="text-3xl font-bold text-accent-900">{roles.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Permissions</p>
                  <p className="text-3xl font-bold text-accent-900">{permissions.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Assigned Users</p>
                  <p className="text-3xl font-bold text-accent-900">
                    {roles.reduce((sum, role) => sum + role.users.length, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-accent-900">{role.name}</h3>
                      {role.isSystemRole && (
                        <Badge variant="info" size="sm">System Role</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-accent-400 hover:text-accent-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    {!role.isSystemRole && (
                      <button className="p-2 text-accent-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-accent-600 mb-4">
                  {role.description || 'No description provided'}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-accent-600">Users with this role:</span>
                    <Badge variant="default">{role.users.length}</Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-accent-700 mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.slice(0, 6).map((rp) => (
                        <Badge key={rp.id} variant="success" size="sm">
                          {rp.permission.resource}:{rp.permission.action}
                        </Badge>
                      ))}
                      {role.permissions.length > 6 && (
                        <Badge variant="default" size="sm">
                          +{role.permissions.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Permissions Matrix */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-accent-900">Permissions Matrix</h3>
            <p className="text-sm text-accent-600 mt-1">
              Overview of all permissions grouped by resource
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {Object.entries(permissionsByResource).map(([resource, perms]) => (
                <div key={resource} className="border border-accent-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-accent-900 mb-3 uppercase tracking-wide">
                    {resource}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {perms.map((perm) => (
                      <div
                        key={perm.id}
                        className="flex items-center space-x-2 p-2 bg-accent-50 rounded-lg"
                      >
                        <Lock className="w-4 h-4 text-accent-400" />
                        <div>
                          <p className="text-sm font-medium text-accent-900">{perm.action}</p>
                          {perm.description && (
                            <p className="text-xs text-accent-500">{perm.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}