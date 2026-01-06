'use client';

import React, { useState, useEffect } from 'react';

import {
  Home,
  Users,
  Settings,
  BarChart3,
  FileText,
  ChevronDown,
  Plus,
  Search,
  Bell,
  User,
  Shield,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import AdminGuard from '../../components/AdminGuard';

// Define TypeScript interfaces for dashboard data
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Moderator' | 'Admin';
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  createdAt: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  resolved: boolean;
  resolvedAt?: string;
  timestamp: string;
}

interface AuditLog {
  id: string;
  action: string;
  type: string;
  user: string;
  resource: string;
  resourceId?: string;
  userId?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

interface DashboardData {
  totalUsers: number;
  newUsersThisMonth: number;
  activeSessions: number;
  sessionGrowth: number;
  systemHealth: number;
  metrics: {
    totalUsers: number;
    userGrowth: number;
    activeSessions: number;
    sessionGrowth: number;
    systemHealth: number;
    activeAlerts: number;
    resolvedAlertsToday: number;
  };
  system: {
    cpuUsage: number;
    memoryUsage: number;
    storageUsage: number;
    networkUsage: number;
  };
  activity: Array<{
    type: 'security' | 'system' | 'maintenance' | 'other';
    message: string;
    timestamp: string;
  }>;
  users?: UserData[];
  alerts?: Alert[];
  auditLogs?: AuditLog[];
}

const adminSidebarItems = [
  {
    title: 'Dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '#',
  },
  {
    title: 'Users',
    label: 'Users',
    icon: Users,
    href: '#',
  },
  {
    title: 'Analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '#',
  },
  {
    title: 'Content',
    label: 'Content',
    icon: FileText,
    href: '#',
  },
  {
    title: 'Security',
    label: 'Security',
    icon: Shield,
    href: '#',
  },
  {
    title: 'Database',
    label: 'Database',
    icon: Database,
    href: '#',
  },
  {
    title: 'System',
    label: 'System',
    icon: Activity,
    href: '#',
  },
  {
    title: 'Settings',
    label: 'Settings',
    icon: Settings,
    href: '#',
  },
];

export default function AdminPage() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user' });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [_bulkActionLoading, setBulkActionLoading] = useState(false);
  const [_alerts, setAlerts] = useState<Alert[]>([]);

  // Handlers
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/dashboard/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Refresh dashboard data
      const dashboardResponse = await fetch('/api/dashboard');
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Error deleting user:', err instanceof Error ? err.message : err);
    }
  };

  const _handleBulkUserAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.length === 0) return;

    if (
      action === 'delete' &&
      !confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)
    )
      return;

    setBulkActionLoading(true);

    try {
      const response = await fetch('/api/dashboard/users/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          userIds: selectedUsers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform bulk action');
      }

      // Clear selection
      setSelectedUsers([]);

      // Refresh dashboard data
      const dashboardResponse = await fetch('/api/dashboard');
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Error performing bulk action:', err instanceof Error ? err.message : err);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleResolveAlert = async (alertId: string, resolved: boolean) => {
    try {
      const response = await fetch(`/api/dashboard/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolved }),
      });

      if (!response.ok) {
        throw new Error('Failed to update alert');
      }

      // Refresh alerts data
      const alertsResponse = await fetch('/api/dashboard/alerts');
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData);
      }
    } catch (err) {
      console.error('Error updating alert:', err instanceof Error ? err.message : err);
    }
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, role: user.role });
    setShowUserDialog(true);
  };

  const handleSaveUser = async () => {
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const url = editingUser ? `/api/dashboard/users/${editingUser.id}` : '/api/dashboard/users';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      setShowUserDialog(false);
      setEditingUser(null);
      setUserForm({ name: '', email: '', role: 'user' });

      // Refresh dashboard data
      const dashboardResponse = await fetch('/api/dashboard');
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Error saving user:', err instanceof Error ? err.message : err);
    }
  };

  // Load dashboard data on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to load dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const filteredUsers = (dashboardData?.users || []).filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
  );
  return (
    <AdminGuard>
      <div className="flex h-screen w-full bg-background">
        {/* Sidebar */}
        <div
          className={`border-r bg-card transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4">
              {sidebarOpen && <span className="font-semibold">Admin Panel</span>}
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${sidebarOpen ? '' : 'rotate-90'}`}
                />
              </Button>
            </div>
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {adminSidebarItems.map((item) => (
                  <Button
                    key={item.label}
                    variant={activeItem === item.label ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveItem(item.label)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {sidebarOpen && item.label}
                  </Button>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="border-b bg-card p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{activeItem}</h1>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            {loading && (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                  <p className="text-muted-foreground">Loading dashboard data...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-center">
                  <XCircle className="mr-2 h-5 w-5 text-red-500" />
                  <p className="text-red-700">Error loading dashboard: {error}</p>
                </div>
              </div>
            )}

            {!loading && !error && dashboardData && (
              <>
                {activeItem === 'Dashboard' && (
                  <>
                    {/* Metrics Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{dashboardData.totalUsers}</div>
                          <p className="text-xs text-muted-foreground">
                            +{dashboardData.newUsersThisMonth} this month
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                          <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{dashboardData.activeSessions}</div>
                          <p className="text-xs text-muted-foreground">
                            {dashboardData.sessionGrowth}% from last hour
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">System Health</CardTitle>
                          <Database className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{dashboardData.systemHealth}%</div>
                          <p className="text-xs text-muted-foreground">All systems operational</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {dashboardData.alerts?.length || 0}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {(dashboardData.alerts || []).filter((a) => !a.resolved).length}{' '}
                            unresolved
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest system activities and events</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {dashboardData.activity?.map((activity, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                              <div className="flex-1">
                                <p className="text-sm">{activity.message}</p>
                                <p className="text-xs text-muted-foreground">
                                  {activity.timestamp}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {activeItem === 'Users' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage user accounts and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search users..."
                            className="rounded border px-3 py-1 text-sm"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                          />
                        </div>
                        <Button onClick={() => setShowUserDialog(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add User
                        </Button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="p-2 text-left">Name</th>
                              <th className="p-2 text-left">Email</th>
                              <th className="p-2 text-left">Role</th>
                              <th className="p-2 text-left">Status</th>
                              <th className="p-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.map((user) => (
                              <tr key={user.id} className="border-b">
                                <td className="p-2">{user.name}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">
                                  <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                                    {user.role}
                                  </Badge>
                                </td>
                                <td className="p-2">
                                  <Badge
                                    variant={user.status === 'Active' ? 'default' : 'destructive'}
                                  >
                                    {user.status}
                                  </Badge>
                                </td>
                                <td className="p-2">
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditUser(user)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteUser(user.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeItem === 'Analytics' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Analytics</CardTitle>
                      <CardDescription>View detailed analytics and reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="py-12 text-center">
                        <BarChart3 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-medium">Analytics Coming Soon</h3>
                        <p className="text-muted-foreground">
                          Detailed analytics and reporting features will be available here.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeItem === 'Content' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Management</CardTitle>
                      <CardDescription>Manage website content and media</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="py-12 text-center">
                        <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-medium">Content Management Coming Soon</h3>
                        <p className="text-muted-foreground">
                          Content management and media library features will be available here.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeItem === 'Security' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Center</CardTitle>
                      <CardDescription>
                        Monitor security events and manage access controls
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="py-12 text-center">
                        <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-medium">Security Center Coming Soon</h3>
                        <p className="text-muted-foreground">
                          Security monitoring and access control features will be available here.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeItem === 'Database' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Database Management</CardTitle>
                      <CardDescription>
                        Monitor database performance and manage data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="py-12 text-center">
                        <Database className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-medium">
                          Database Management Coming Soon
                        </h3>
                        <p className="text-muted-foreground">
                          Database monitoring and management features will be available here.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeItem === 'System' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>System Monitoring</CardTitle>
                      <CardDescription>Monitor system performance and health</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <h4 className="mb-2 font-medium">CPU Usage</h4>
                            <div className="h-4 w-full rounded-full bg-gray-200">
                              <div
                                className="h-4 rounded-full bg-blue-600"
                                style={{ width: `${dashboardData.system?.cpuUsage || 0}%` }}
                              />
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {dashboardData.system?.cpuUsage || 0}% utilization
                            </p>
                          </div>
                          <div>
                            <h4 className="mb-2 font-medium">Memory Usage</h4>
                            <div className="h-4 w-full rounded-full bg-gray-200">
                              <div
                                className="h-4 rounded-full bg-green-600"
                                style={{ width: `${dashboardData.system?.memoryUsage || 0}%` }}
                              />
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {dashboardData.system?.memoryUsage || 0}% utilization
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeItem === 'Settings' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                      <CardDescription>Configure system settings and preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="py-12 text-center">
                        <Settings className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-medium">Settings Coming Soon</h3>
                        <p className="text-muted-foreground">
                          System configuration and settings will be available here.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Alerts Section - Show on Dashboard and System */}
                {(activeItem === 'Dashboard' || activeItem === 'System') && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>System Alerts</CardTitle>
                      <CardDescription>Monitor and resolve system alerts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(dashboardData.alerts || []).map((alert) => (
                          <div
                            key={alert.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                          >
                            <div className="flex items-center space-x-3">
                              <AlertTriangle className="h-5 w-5 text-orange-500" />
                              <div>
                                <p className="font-medium">{alert.title}</p>
                                <p className="text-sm text-muted-foreground">{alert.description}</p>
                                <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                              >
                                {alert.severity}
                              </Badge>
                              {!alert.resolved && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResolveAlert(alert.id, true)}
                                >
                                  Resolve
                                </Button>
                              )}
                              {alert.resolved && <CheckCircle className="h-5 w-5 text-green-500" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Audit Logs Section - Show on Dashboard and Security */}
                {(activeItem === 'Dashboard' || activeItem === 'Security') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Audit Logs</CardTitle>
                      <CardDescription>View recent system activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(dashboardData.auditLogs || []).map((log) => (
                          <div
                            key={log.id}
                            className="flex items-center justify-between rounded border p-3"
                          >
                            <div>
                              <p className="text-sm">{log.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {log.timestamp} by {log.user}
                              </p>
                            </div>
                            <Badge variant="outline">{log.type}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Update user information and permissions.'
                : 'Create a new user account with appropriate permissions.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                className="mt-1 w-full rounded border px-3 py-2"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded border px-3 py-2"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <select
                className="mt-1 w-full rounded border px-3 py-2"
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveUser}>{editingUser ? 'Update' : 'Create'} User</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminGuard>
  );
}
