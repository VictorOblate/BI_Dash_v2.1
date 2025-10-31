// dashboard-app/app/dashboard/reports/page.tsx

import { redirect } from 'next/navigation';
import { auth } from '@/lib/nextAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock,
  Eye,
  Plus,
  Filter
} from 'lucide-react';

export default async function ReportsPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  // Sample reports data
  const reports = [
    {
      id: 1,
      name: 'Monthly Sales Report',
      description: 'Comprehensive overview of monthly sales performance',
      type: 'Sales',
      format: 'PDF',
      lastGenerated: '2025-10-30',
      status: 'completed',
      size: '2.4 MB',
    },
    {
      id: 2,
      name: 'User Activity Report',
      description: 'Analysis of user engagement and activity metrics',
      type: 'Analytics',
      format: 'Excel',
      lastGenerated: '2025-10-29',
      status: 'completed',
      size: '1.8 MB',
    },
    {
      id: 3,
      name: 'Financial Summary Q4',
      description: 'Quarterly financial performance and projections',
      type: 'Finance',
      format: 'PDF',
      lastGenerated: '2025-10-28',
      status: 'completed',
      size: '3.2 MB',
    },
    {
      id: 4,
      name: 'Data Quality Report',
      description: 'Data completeness and accuracy metrics',
      type: 'Data Quality',
      format: 'PDF',
      lastGenerated: '2025-10-27',
      status: 'completed',
      size: '1.5 MB',
    },
  ];

  const reportTypes = ['All', 'Sales', 'Analytics', 'Finance', 'Data Quality'];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'success',
      processing: 'warning',
      failed: 'danger',
    };
    return variants[status] || 'default';
  };

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-accent-900">Reports</h1>
            <p className="text-accent-600 mt-1">Generate and manage your business reports</p>
          </div>
          <Button className="sm:w-auto w-full">
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Total Reports</p>
                  <p className="text-3xl font-bold text-accent-900">{reports.length}</p>
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
                  <p className="text-sm text-accent-600 mb-1">This Month</p>
                  <p className="text-3xl font-bold text-accent-900">12</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Scheduled</p>
                  <p className="text-3xl font-bold text-accent-900">5</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-accent-600 mb-1">Total Size</p>
                  <p className="text-3xl font-bold text-accent-900">24.8 MB</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {reportTypes.map((type) => (
                    <button
                      key={type}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border-2 border-accent-200 hover:border-primary-500 hover:bg-primary-50 text-accent-700"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Card key={report.id} hover>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-accent-900">{report.name}</h3>
                      <Badge variant="default" size="sm">{report.type}</Badge>
                    </div>
                  </div>
                  <Badge variant={getStatusBadge(report.status)} size="sm">
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-accent-600 mb-4">{report.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-accent-600">Format:</span>
                    <span className="font-medium text-accent-900">{report.format}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-accent-600">Size:</span>
                    <span className="font-medium text-accent-900">{report.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-accent-600">Last Generated:</span>
                    <span className="font-medium text-accent-900">
                      {new Date(report.lastGenerated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Scheduled Reports */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-accent-900">Scheduled Reports</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[
                { name: 'Weekly Performance Summary', frequency: 'Every Monday at 9:00 AM', nextRun: 'Nov 4, 2025' },
                { name: 'Monthly Financial Report', frequency: 'First day of month at 8:00 AM', nextRun: 'Dec 1, 2025' },
                { name: 'Daily Activity Report', frequency: 'Every day at 6:00 PM', nextRun: 'Today at 6:00 PM' },
              ].map((scheduled, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-accent-200 rounded-lg hover:border-primary-500 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-accent-900">{scheduled.name}</p>
                      <p className="text-sm text-accent-600">{scheduled.frequency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-accent-600">Next run:</p>
                    <p className="text-sm font-medium text-accent-900">{scheduled.nextRun}</p>
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