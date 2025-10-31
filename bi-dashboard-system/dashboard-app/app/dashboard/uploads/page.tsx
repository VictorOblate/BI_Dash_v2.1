// dashboard-app/app/dashboard/uploads/page.tsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Upload, FileText, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';

export default async function UploadsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user is admin
  if (!isAdmin(session.user.roles)) {
    redirect('/dashboard');
  }

  // Fetch uploads and data models
  const [uploads, dataModels] = await Promise.all([
    prisma.uploadHistory.findMany({
      include: {
        user: true,
        dataModel: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    }),
    prisma.dataModel.findMany({
      where: { isActive: 1 },
      select: { id: true, displayName: true },
    }),
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      completed: { variant: 'success', icon: CheckCircle },
      failed: { variant: 'danger', icon: XCircle },
      processing: { variant: 'info', icon: Clock },
      pending: { variant: 'warning', icon: Clock },
      reverted: { variant: 'default', icon: RotateCcw },
    };
    return variants[status] || { variant: 'default', icon: FileText };
  };

  const stats = {
    total: uploads.length,
    completed: uploads.filter(u => u.status === 'completed').length,
    failed: uploads.filter(u => u.status === 'failed').length,
    processing: uploads.filter(u => u.status === 'processing').length,
  };

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-accent-900">Data Uploads</h1>
            <p className="text-accent-600 mt-1">Import and manage your data files</p>
          </div>
          <Button className="sm:w-auto w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload New File
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Total Uploads</p>
                  <p className="text-3xl font-bold text-accent-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-accent-900">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Failed</p>
                  <p className="text-3xl font-bold text-accent-900">{stats.failed}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Processing</p>
                  <p className="text-3xl font-bold text-accent-900">{stats.processing}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Upload History Table */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-accent-900">Upload History</h3>
          </CardHeader>
          <CardBody className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Data Model</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploads.map((upload) => {
                  const statusInfo = getStatusBadge(upload.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <TableRow key={upload.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-accent-400" />
                          <span className="font-medium text-accent-900">{upload.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-accent-700">
                        {upload.dataModel?.displayName || 'N/A'}
                      </TableCell>
                      <TableCell className="text-accent-700">
                        {upload.user?.fullName || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-accent-900 font-medium">
                            {upload.recordsCount?.toLocaleString() || 0}
                          </p>
                          {upload.recordsSuccess !== null && (
                            <p className="text-xs text-accent-500">
                              {upload.recordsSuccess} success, {upload.recordsFailed} failed
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant} size="sm">
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {upload.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-accent-600">
                        {formatDateTime(upload.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">View</Button>
                          {upload.status === 'completed' && (
                            <Button variant="ghost" size="sm">
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Empty State */}
        {uploads.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-accent-900 mb-2">No uploads yet</h3>
              <p className="text-accent-600 mb-6">
                Start by uploading your first data file
              </p>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First File
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}