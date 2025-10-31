// dashboard-app/app/dashboard/settings/page.tsx

'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield,
  Mail,
  Save,
  CheckCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/signin');
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-accent-900">Settings</h1>
          <p className="text-accent-600 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="lg:col-span-1 h-fit">
            <CardBody className="p-3">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-accent-600 hover:bg-accent-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardBody>
          </Card>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-accent-900">Profile Information</h3>
                  <p className="text-sm text-accent-600 mt-1">
                    Update your personal information and profile picture
                  </p>
                </CardHeader>
                <CardBody className="space-y-6">
                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-medium text-accent-700 mb-3">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Change Photo</Button>
                        <p className="text-xs text-accent-500 mt-2">
                          JPG, PNG or GIF. Max size 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      defaultValue={session.user.name}
                      placeholder="John Doe"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      defaultValue={session.user.email}
                      placeholder="john@example.com"
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                    />
                    <Input
                      label="Job Title"
                      placeholder="Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-accent-700 mb-1.5">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-4">
                    <Button onClick={handleSave} loading={saving}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    {saved && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Changes saved</span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-accent-900">Security Settings</h3>
                  <p className="text-sm text-accent-600 mt-1">
                    Manage your password and security preferences
                  </p>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="Enter current password"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                      helperText="Must be at least 8 characters"
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="pt-4 border-t border-accent-200">
                    <h4 className="text-sm font-semibold text-accent-900 mb-4">
                      Two-Factor Authentication
                    </h4>
                    <div className="flex items-center justify-between p-4 bg-accent-50 rounded-lg">
                      <div>
                        <p className="font-medium text-accent-900">Enable 2FA</p>
                        <p className="text-sm text-accent-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-accent-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-accent-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-accent-200">
                    <h4 className="text-sm font-semibold text-accent-900 mb-4">
                      Active Sessions
                    </h4>
                    <div className="space-y-3">
                      {[
                        { device: 'Chrome on macOS', location: 'Maseru, LS', current: true },
                        { device: 'Safari on iPhone', location: 'Maseru, LS', current: false },
                      ].map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-accent-200 rounded-lg">
                          <div>
                            <p className="font-medium text-accent-900">
                              {session.device}
                              {session.current && (
                                <span className="ml-2 text-xs text-green-600 font-semibold">
                                  Current Session
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-accent-600">{session.location}</p>
                          </div>
                          {!session.current && (
                            <Button variant="outline" size="sm">
                              Revoke
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSave} loading={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    Update Security Settings
                  </Button>
                </CardBody>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-accent-900">Notification Preferences</h3>
                  <p className="text-sm text-accent-600 mt-1">
                    Choose what notifications you want to receive
                  </p>
                </CardHeader>
                <CardBody className="space-y-6">
                  {[
                    {
                      title: 'Email Notifications',
                      items: [
                        { label: 'Account activity', description: 'Receive notifications about account changes' },
                        { label: 'Weekly reports', description: 'Get weekly summary of your dashboard metrics' },
                        { label: 'Data uploads', description: 'Notifications when data uploads complete' },
                        { label: 'System updates', description: 'Important system updates and maintenance' },
                      ]
                    },
                    {
                      title: 'Push Notifications',
                      items: [
                        { label: 'Real-time alerts', description: 'Instant notifications for critical events' },
                        { label: 'Approval requests', description: 'Notifications for pending approvals' },
                      ]
                    }
                  ].map((section, sIndex) => (
                    <div key={sIndex} className="space-y-4">
                      <h4 className="text-sm font-semibold text-accent-900">{section.title}</h4>
                      {section.items.map((item, iIndex) => (
                        <div key={iIndex} className="flex items-center justify-between p-4 border border-accent-200 rounded-lg">
                          <div>
                            <p className="font-medium text-accent-900">{item.label}</p>
                            <p className="text-sm text-accent-600">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={iIndex < 2} className="sr-only peer" />
                            <div className="w-11 h-6 bg-accent-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-accent-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}

                  <Button onClick={handleSave} loading={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardBody>
              </Card>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-accent-900">Display Preferences</h3>
                  <p className="text-sm text-accent-600 mt-1">
                    Customize how you see and interact with the dashboard
                  </p>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-accent-700 mb-1.5">
                        Language
                      </label>
                      <select className="w-full px-4 py-2.5 rounded-lg border-2 border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>English</option>
                        <option>Sesotho</option>
                        <option>Afrikaans</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-accent-700 mb-1.5">
                        Timezone
                      </label>
                      <select className="w-full px-4 py-2.5 rounded-lg border-2 border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>Africa/Maseru (GMT+2)</option>
                        <option>Africa/Johannesburg (GMT+2)</option>
                        <option>UTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-accent-700 mb-1.5">
                        Date Format
                      </label>
                      <select className="w-full px-4 py-2.5 rounded-lg border-2 border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-accent-700 mb-1.5">
                        Currency
                      </label>
                      <select className="w-full px-4 py-2.5 rounded-lg border-2 border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>LSL (Lesotho Loti)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-accent-200">
                    <h4 className="text-sm font-semibold text-accent-900 mb-4">
                      Dashboard Options
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Show dashboard tips', description: 'Display helpful tips and guidance' },
                        { label: 'Compact view', description: 'Use a more compact layout to fit more content' },
                        { label: 'Auto-refresh data', description: 'Automatically refresh dashboard data' },
                      ].map((option, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-accent-200 rounded-lg">
                          <div>
                            <p className="font-medium text-accent-900">{option.label}</p>
                            <p className="text-sm text-accent-600">{option.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={index === 0} className="sr-only peer" />
                            <div className="w-11 h-6 bg-accent-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-accent-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSave} loading={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardBody>
              </Card>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-accent-900">Privacy & Data</h3>
                  <p className="text-sm text-accent-600 mt-1">
                    Control how your data is used and shared
                  </p>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { 
                        label: 'Profile Visibility', 
                        description: 'Control who can see your profile information',
                        type: 'select',
                        options: ['Everyone', 'Team members only', 'Admins only']
                      },
                      { 
                        label: 'Activity Status', 
                        description: 'Show when you\'re online or active',
                        type: 'toggle'
                      },
                      { 
                        label: 'Data Analytics', 
                        description: 'Allow usage data to improve the platform',
                        type: 'toggle'
                      },
                    ].map((setting, index) => (
                      <div key={index} className="p-4 border border-accent-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-accent-900">{setting.label}</p>
                            <p className="text-sm text-accent-600">{setting.description}</p>
                          </div>
                          {setting.type === 'toggle' ? (
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-accent-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-accent-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          ) : (
                            <select className="px-3 py-1.5 rounded-lg border-2 border-accent-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                              {setting.options?.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-accent-200">
                    <h4 className="text-sm font-semibold text-accent-900 mb-4">
                      Data Management
                    </h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-between">
                        <span>Download your data</span>
                        <span className="text-xs text-accent-500">Export all your information</span>
                      </Button>
                      <Button variant="outline" className="w-full justify-between text-red-600 hover:bg-red-50 border-red-200">
                        <span>Delete account</span>
                        <span className="text-xs text-red-500">Permanently remove your account</span>
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleSave} loading={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}