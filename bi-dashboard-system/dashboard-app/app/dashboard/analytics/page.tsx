// dashboard-app/app/dashboard/analytics/page.tsx

'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Download, RefreshCw, Filter } from 'lucide-react';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [dateRange, setDateRange] = useState('30');
  const [refreshing, setRefreshing] = useState(false);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/signin');
  }

  // Sample data for visualizations
  const lineChartData = [
    {
      x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      y: [120, 145, 160, 155, 180, 195],
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Revenue',
      line: { color: '#22c55e', width: 3 },
      marker: { size: 8, color: '#22c55e' },
    },
    {
      x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      y: [100, 120, 140, 130, 150, 170],
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Target',
      line: { color: '#64748b', width: 2, dash: 'dash' },
      marker: { size: 6, color: '#64748b' },
    },
  ];

  const barChartData = [
    {
      x: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
      y: [450, 380, 290, 350, 420],
      type: 'bar',
      marker: {
        color: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
      },
    },
  ];

  const pieChartData = [
    {
      values: [35, 25, 20, 15, 5],
      labels: ['North America', 'Europe', 'Asia', 'South America', 'Others'],
      type: 'pie',
      marker: {
        colors: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
      },
      textinfo: 'label+percent',
      textposition: 'outside',
      hole: 0.4,
    },
  ];

  const heatmapData = [
    {
      z: [
        [10, 20, 30, 40, 50],
        [15, 25, 35, 45, 55],
        [20, 30, 40, 50, 60],
        [25, 35, 45, 55, 65],
      ],
      x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      y: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      type: 'heatmap',
      colorscale: [
        [0, '#dcfce7'],
        [0.5, '#22c55e'],
        [1, '#14532d'],
      ],
    },
  ];

  const commonLayout = {
    font: { family: 'Inter, sans-serif' },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { t: 40, r: 20, b: 40, l: 50 },
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-accent-900">Analytics Dashboard</h1>
            <p className="text-accent-600 mt-1">Visualize and analyze your business data</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select
              options={[
                { value: '7', label: 'Last 7 days' },
                { value: '30', label: 'Last 30 days' },
                { value: '90', label: 'Last 90 days' },
                { value: 'custom', label: 'Custom range' },
              ]}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: '$125,430', change: '+12.5%', trend: 'up' },
            { label: 'Active Users', value: '8,924', change: '+8.3%', trend: 'up' },
            { label: 'Conversion Rate', value: '3.24%', change: '-2.1%', trend: 'down' },
            { label: 'Avg. Order Value', value: '$142', change: '+5.7%', trend: 'up' },
          ].map((metric, index) => (
            <Card key={index}>
              <CardBody>
                <p className="text-sm text-accent-600 mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-accent-900 mb-2">{metric.value}</p>
                <p
                  className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.change} vs last period
                </p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-accent-900">Revenue Trend</h3>
            </CardHeader>
            <CardBody>
              <Plot
                data={lineChartData}
                layout={{
                  ...commonLayout,
                  title: '',
                  xaxis: { title: 'Month' },
                  yaxis: { title: 'Revenue ($K)' },
                  showlegend: true,
                  legend: { x: 0, y: 1.1, orientation: 'h' },
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '300px' }}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-accent-900">Product Performance</h3>
            </CardHeader>
            <CardBody>
              <Plot
                data={barChartData}
                layout={{
                  ...commonLayout,
                  title: '',
                  xaxis: { title: 'Products' },
                  yaxis: { title: 'Sales' },
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '300px' }}
              />
            </CardBody>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-accent-900">Regional Distribution</h3>
            </CardHeader>
            <CardBody>
              <Plot
                data={pieChartData}
                layout={{
                  ...commonLayout,
                  title: '',
                  showlegend: true,
                  legend: { x: 0, y: -0.1, orientation: 'h' },
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '300px' }}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-accent-900">Activity Heatmap</h3>
            </CardHeader>
            <CardBody>
              <Plot
                data={heatmapData}
                layout={{
                  ...commonLayout,
                  title: '',
                  xaxis: { title: 'Day of Week' },
                  yaxis: { title: 'Week' },
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '300px' }}
              />
            </CardBody>
          </Card>
        </div>

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-accent-900">Top Performing Items</h3>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-accent-700">Rank</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-accent-700">Item</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-accent-700">Sales</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-accent-700">Revenue</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-accent-700">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, item: 'Product Alpha', sales: 2145, revenue: '$42,900', growth: '+15.2%' },
                    { rank: 2, item: 'Product Beta', sales: 1923, revenue: '$38,460', growth: '+12.8%' },
                    { rank: 3, item: 'Product Gamma', sales: 1756, revenue: '$35,120', growth: '+9.4%' },
                    { rank: 4, item: 'Product Delta', sales: 1634, revenue: '$32,680', growth: '+7.1%' },
                    { rank: 5, item: 'Product Epsilon', sales: 1521, revenue: '$30,420', growth: '+5.3%' },
                  ].map((item) => (
                    <tr key={item.rank} className="border-b border-accent-100 hover:bg-accent-50">
                      <td className="px-4 py-3 text-sm text-accent-900">#{item.rank}</td>
                      <td className="px-4 py-3 text-sm font-medium text-accent-900">{item.item}</td>
                      <td className="px-4 py-3 text-sm text-accent-700">{item.sales.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-accent-700">{item.revenue}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{item.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}