// dashboard-app/app/dashboard/data-models/page.tsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Database, Edit, Trash2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';

export default async function DataModelsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user is admin
  if (!isAdmin(session.user.roles)) {
    redirect('/dashboard');
  }

  // Fetch data models
  const dataModels = await prisma.dataModel.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-accent-900">Data Models</h1>
            <p className="text-accent-600 mt-1">Define and manage your data structures</p>
          </div>
          <Button className="sm:w-auto w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Data Model
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Total Models</p>
                  <p className="text-3xl font-bold text-accent-900">{dataModels.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Active Models</p>
                  <p className="text-3xl font-bold text-accent-900">
                    {dataModels.filter(m => m.isActive === 1).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Total Fields</p>
                  <p className="text-3xl font-bold text-accent-900">
                    {dataModels.reduce((acc, model) => {
                      const schema = model.schemaJson as any[];
                      return acc + (schema?.length || 0);
                    }, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Data Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataModels.map((model) => {
            const schema = model.schemaJson as any[];
            return (
              <Card key={model.id} hover>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-accent-900 mb-1">
                        {model.displayName}
                      </h3>
                      <Badge variant={model.isActive === 1 ? 'success' : 'default'} size="sm">
                        {model.isActive === 1 ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-accent-600 mb-4">
                    {model.description || 'No description provided'}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-accent-600">Fields:</span>
                      <span className="font-medium text-accent-900">{schema?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-accent-600">Version:</span>
                      <span className="font-medium text-accent-900">v{model.version}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-accent-600">Created:</span>
                      <span className="font-medium text-accent-900">
                        {new Date(model.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {dataModels.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-accent-900 mb-2">No data models yet</h3>
              <p className="text-accent-600 mb-6">
                Get started by creating your first data model to define your data structure
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Model
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}