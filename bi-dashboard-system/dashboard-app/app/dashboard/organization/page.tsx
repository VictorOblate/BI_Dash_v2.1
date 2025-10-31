// dashboard-app/app/dashboard/organization/page.tsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Building2, Plus, Users, Edit, Trash2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';

export default async function OrganizationPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user is admin
  if (!isAdmin(session.user.roles)) {
    redirect('/dashboard');
  }

  // Fetch organizational units
  const orgUnits = await prisma.organizationalUnit.findMany({
    include: {
      parent: true,
      children: true,
      users: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      path: 'asc',
    },
  });

  // Organize units by type
  const unitsByType = orgUnits.reduce((acc, unit) => {
    if (!acc[unit.type]) acc[unit.type] = [];
    acc[unit.type].push(unit);
    return acc;
  }, {} as Record<string, typeof orgUnits>);

  const typeConfig = {
    company: { label: 'Companies', icon: Building2, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    division: { label: 'Divisions', icon: Building2, color: 'text-green-600', bgColor: 'bg-green-100' },
    department: { label: 'Departments', icon: Building2, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    team: { label: 'Teams', icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  };

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-accent-900">Organization Structure</h1>
            <p className="text-accent-600 mt-1">Manage your company hierarchy and teams</p>
          </div>
          <Button className="sm:w-auto w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Unit
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(typeConfig).map(([type, config]) => {
            const Icon = config.icon;
            const count = unitsByType[type]?.length || 0;
            return (
              <Card key={type}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-accent-600 mb-1">{config.label}</p>
                      <p className="text-3xl font-bold text-accent-900">{count}</p>
                    </div>
                    <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Organization Tree */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-accent-900">Hierarchy View</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {Object.entries(typeConfig).map(([type, config]) => {
                const units = unitsByType[type] || [];
                const Icon = config.icon;

                if (units.length === 0) return null;

                return (
                  <div key={type}>
                    <h4 className="text-sm font-semibold text-accent-700 mb-3 uppercase tracking-wide">
                      {config.label}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {units.map((unit) => (
                        <div
                          key={unit.id}
                          className="border-2 border-accent-200 rounded-xl p-4 hover:border-primary-500 hover:bg-primary-50 transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${config.color}`} />
                              </div>
                              <div>
                                <h5 className="font-semibold text-accent-900">{unit.name}</h5>
                                {unit.parent && (
                                  <p className="text-xs text-accent-500">
                                    Parent: {unit.parent.name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button className="p-1 text-accent-400 hover:text-accent-600 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-accent-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {unit.description && (
                            <p className="text-sm text-accent-600 mb-3">{unit.description}</p>
                          )}

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2 text-accent-600">
                              <Users className="w-4 h-4" />
                              <span>{unit.users.length} members</span>
                            </div>
                            {unit.children.length > 0 && (
                              <div className="flex items-center space-x-2 text-accent-600">
                                <Building2 className="w-4 h-4" />
                                <span>{unit.children.length} sub-units</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Empty State */}
        {orgUnits.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-accent-900 mb-2">No organizational units</h3>
              <p className="text-accent-600 mb-6">
                Start building your organization structure by adding your first unit
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Unit
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}