// dashboard-app/app/dashboard/page.tsx

import { auth } from '@/lib/nextAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { 
  TrendingUp, 
  Users, 
  Database, 
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch dashboard statistics
  const [userCount, dataModelCount, uploadCount, recentActivity] = await Promise.all([
    prisma.user.count(),
    prisma.dataModel.count({ where: { isActive: 1 } }),
    prisma.uploadHistory.count(),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    }),
  ]);

  const stats = [
    {
      title: 'Total Users',
      value: userCount,
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Data Models',
      value: dataModelCount,
      change: '+3',
      trend: 'up',
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Uploads',
      value: uploadCount,
      change: '+24',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'System Health',
      value: '99.9%',
      change: '+0.2%',
      trend: 'up',
      icon: Activity,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
  ];

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
            <p className="text-primary-100">
              Monitor your business intelligence metrics and system performance
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/10 rounded-full translate-y-1/2"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-accent-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-accent-900 mb-2">
                        {stat.value}
                      </p>
                      <div className="flex items-center space-x-1">
                        {stat.trend === 'up' ? (
                          <ArrowUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-accent-500">vs last month</span>
                      </div>
                    </div>
                    <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-accent-900">Recent Activity</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-accent-100 last:border-0">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-accent-900">
                        {activity.user?.fullName || 'System'}
                      </p>
                      <p className="text-sm text-accent-600">
                        {activity.action} {activity.resource}
                      </p>
                      <p className="text-xs text-accent-500 mt-1">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-accent-900">Quick Actions</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/dashboard/data-models"
                  className="p-4 border-2 border-accent-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <Database className="w-8 h-8 text-accent-400 group-hover:text-primary-600 mb-2" />
                  <p className="font-medium text-accent-900">Data Models</p>
                  <p className="text-xs text-accent-500">Manage schemas</p>
                </a>

                <a
                  href="/dashboard/uploads"
                  className="p-4 border-2 border-accent-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <TrendingUp className="w-8 h-8 text-accent-400 group-hover:text-primary-600 mb-2" />
                  <p className="font-medium text-accent-900">Upload Data</p>
                  <p className="text-xs text-accent-500">Import files</p>
                </a>

                <a
                  href="/dashboard/analytics"
                  className="p-4 border-2 border-accent-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <Activity className="w-8 h-8 text-accent-400 group-hover:text-primary-600 mb-2" />
                  <p className="font-medium text-accent-900">Analytics</p>
                  <p className="text-xs text-accent-500">View insights</p>
                </a>

                <a
                  href="/dashboard/users"
                  className="p-4 border-2 border-accent-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <Users className="w-8 h-8 text-accent-400 group-hover:text-primary-600 mb-2" />
                  <p className="font-medium text-accent-900">Users</p>
                  <p className="text-xs text-accent-500">Manage access</p>
                </a>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}