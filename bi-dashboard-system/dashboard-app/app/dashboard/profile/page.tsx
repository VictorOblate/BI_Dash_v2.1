// dashboard-app/app/dashboard/profile/page.tsx

'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield,
  Save,
  CheckCircle,
  Camera
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
    bio: '',
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/signin');
  }

  const handleEdit = () => {
    setFormData({
      fullName: session.user.name,
      email: session.user.email,
      phone: '',
      jobTitle: '',
      bio: '',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      await update();
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setSaved(false);
  };

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-accent-900">My Profile</h1>
          <p className="text-accent-600 mt-1">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardBody className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto">
                  {getInitials(session.user.name)}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full border-2 border-accent-200 flex items-center justify-center hover:bg-accent-50 transition-colors">
                  <Camera className="w-5 h-5 text-accent-600" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-accent-900 mb-1">
                {session.user.name}
              </h2>
              <p className="text-accent-600 mb-4">{session.user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {session.user.roles.map((role: string) => (
                  <Badge key={role} variant="success">
                    {role}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-accent-200">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-accent-600">Member since</span>
                    <span className="font-medium text-accent-900">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-accent-600">Last login</span>
                    <span className="font-medium text-accent-900">Today</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Profile Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-accent-900">Profile Information</h3>
                {!editing && (
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {editing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+266 5000 0000"
                    />
                    <Input
                      label="Job Title"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
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
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button onClick={handleSave} loading={saving}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-accent-600 mb-1 block">
                        Full Name
                      </label>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-accent-400" />
                        <p className="text-accent-900">{session.user.name}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-accent-600 mb-1 block">
                        Email Address
                      </label>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-accent-400" />
                        <p className="text-accent-900">{session.user.email}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-accent-600 mb-1 block">
                        Phone Number
                      </label>
                      <p className="text-accent-900">+266 5000 0000</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-accent-600 mb-1 block">
                        Job Title
                      </label>
                      <p className="text-accent-900">Software Engineer</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-accent-600 mb-1 block">
                      Bio
                    </label>
                    <p className="text-accent-900">
                      Passionate about data analytics and business intelligence. Experienced in building scalable dashboards and reporting systems.
                    </p>
                  </div>
                </div>
              )}

              {saved && (
                <div className="mt-4 flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Profile updated successfully</span>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Account Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-accent-900">Recent Activity</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[
                { action: 'Logged in', time: '2 hours ago', icon: Shield },
                { action: 'Updated dashboard', time: '5 hours ago', icon: User },
                { action: 'Uploaded data file', time: '1 day ago', icon: Calendar },
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-4 pb-4 border-b border-accent-100 last:border-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-accent-900">{activity.action}</p>
                      <p className="text-sm text-accent-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}