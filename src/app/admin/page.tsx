'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  RefreshCw,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
} from 'lucide-react';

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
  message: string;
  resolved: boolean;
  resolvedAt?: string;
  timestamp: string;
}

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  userId?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

interface DashboardData {
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
    icon: Home,
    href: '#',
  },
  {
    title: 'Users',
    icon: Users,
    href: '#',
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '#',
  },
  {
    title: 'Content',
    icon: FileText,
    href: '#',
  },
  {
    title: 'Security',
    icon: Shield,
    href: '#',
  },
  {
    title: 'Database',
    icon: Database,
    href: '#',
  },
  {
    title: 'System',
    icon: Activity,
    href: '#',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '#',
  },
];

export default function AdminPage() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for user form
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'User',
  });
  const [userFormLoading, setUserFormLoading] = useState(false);

  // State for user editing
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editUserFormOpen, setEditUserFormOpen] = useState(false);
  const [editUserFormData, setEditUserFormData] = useState({
    name: '',
    email: '',
    role: 'User',
  });
  const [editUserFormLoading, setEditUserFormLoading] = useState(false);

  // State for bulk operations
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // State for alerts
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);

  // State for audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormLoading(true);

    try {
      const response = await fetch('/api/dashboard/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      // Reset form
      setUserFormData({ name: '', email: '', role: 'User' });
      setUserFormOpen(false);

      // Refresh dashboard data
      const dashboardResponse = await fetch('/api/dashboard');
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error(
        'Error creating user:',
        err instanceof Error ? err.message : err
      );
    } finally {
      setUserFormLoading(false);
    }
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setEditUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setEditUserFormOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setEditUserFormLoading(true);

    try {
      const response = await fetch(`/api/dashboard/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editUserFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Reset form
      setEditUserFormData({ name: '', email: '', role: 'User' });
      setEditUserFormOpen(false);
      setEditingUser(null);

      // Refresh dashboard data
      const dashboardResponse = await fetch('/api/dashboard');
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error(
        'Error updating user:',
        err instanceof Error ? err.message : err
      );
    } finally {
      setEditUserFormLoading(false);
    }
  };

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
      console.error(
        'Error deleting user:',
        err instanceof Error ? err.message : err
      );
    }
  };

  const handleBulkUserAction = async (
    action: 'activate' | 'deactivate' | 'delete'
  ) => {
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
      console.error(
        'Error performing bulk action:',
        err instanceof Error ? err.message : err
      );
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

      // Refresh alerts
      await fetchAlerts();
    } catch (err) {
      console.error(
        'Error updating alert:',
        err instanceof Error ? err.message : err
      );
    }
  };

  const fetchAlerts = async () => {
    setAlertsLoading(true);
    try {
      const response = await fetch('/api/dashboard/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error(
        'Error fetching alerts:',
        err instanceof Error ? err.message : err
      );
    } finally {
      setAlertsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setAuditLogsLoading(true);
    try {
      const response = await fetch('/api/dashboard/audit');
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.auditLogs || []);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err instanceof Error ? err.message : err);
    } finally {
      setAuditLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchAuditLogs();
  }, []);

  return (
    <div className="flex h-screen w-full bg-background">
      {sidebarOpen && (
        <Sidebar className="w-64 border-r">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Admin Panel</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminSidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => setActiveItem(item.title)}
                        isActive={activeItem === item.title}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator />

            <SidebarGroup>
              <SidebarGroupLabel>System Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <ChevronDown className="w-4 h-4" />
                      <span>Core Systems</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton size="sm">
                          <span>User Management</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton size="sm">
                          <span>Database</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton size="sm">
                          <span>Security</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    sidebarOpen ? 'rotate-90' : ''
                  }`}
                />
              </Button>
              <h1 className="text-2xl font-semibold">{activeItem}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Loading dashboard data...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">Error loading dashboard: {error}</p>
              </div>
            </div>
          )}

          {dashboardData && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData.metrics.totalUsers.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardData.metrics.userGrowth >= 0 ? '+' : ''}
                      {dashboardData.metrics.userGrowth}% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Sessions
                    </CardTitle>
                    <Activity className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData.metrics.activeSessions.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardData.metrics.sessionGrowth >= 0 ? '+' : ''}
                      {dashboardData.metrics.sessionGrowth}% from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      System Health
                    </CardTitle>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData.metrics.systemHealth}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All systems operational
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Security Alerts
                    </CardTitle>
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData.metrics.activeAlerts}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardData.metrics.resolvedAlertsToday} resolved today
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* System Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Performance</CardTitle>
                    <CardDescription>
                      Current system resource utilization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU Usage</span>
                        <span>{dashboardData.system.cpuUsage}%</span>
                      </div>
                      <Progress value={dashboardData.system.cpuUsage} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memory Usage</span>
                        <span>{dashboardData.system.memoryUsage}%</span>
                      </div>
                      <Progress value={dashboardData.system.memoryUsage} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Storage</span>
                        <span>{dashboardData.system.storageUsage}%</span>
                      </div>
                      <Progress value={dashboardData.system.storageUsage} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Network I/O</span>
                        <span>{dashboardData.system.networkUsage}%</span>
                      </div>
                      <Progress value={dashboardData.system.networkUsage} />
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest system events and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.activity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              activity.type === 'security'
                                ? 'bg-green-500'
                                : activity.type === 'system'
                                ? 'bg-blue-500'
                                : activity.type === 'maintenance'
                                ? 'bg-orange-500'
                                : 'bg-purple-500'
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p className="text-sm">{activity.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.timestamp}
                            </p>
                          </div>
                          <Badge
                            variant={
                              activity.type === 'security'
                                ? 'secondary'
                                : activity.type === 'system'
                                ? 'default'
                                : activity.type === 'maintenance'
                                ? 'destructive'
                                : 'outline'
                            }
                          >
                            {activity.type.charAt(0).toUpperCase() +
                              activity.type.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>
                        Manage user accounts and permissions
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedUsers.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              disabled={bulkActionLoading}
                            >
                              <MoreHorizontal className="w-4 h-4 mr-2" />
                              Bulk Actions ({selectedUsers.length})
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleBulkUserAction('activate')}
                            >
                              Activate Users
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleBulkUserAction('deactivate')}
                            >
                              Deactivate Users
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleBulkUserAction('delete')}
                              className="text-red-600"
                            >
                              Delete Users
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      <Dialog
                        open={userFormOpen}
                        onOpenChange={setUserFormOpen}
                      >
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add User
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                              Create a new user account with appropriate
                              permissions.
                            </DialogDescription>
                          </DialogHeader>
                          <form
                            onSubmit={handleCreateUser}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <label
                                htmlFor="name"
                                className="text-sm font-medium"
                              >
                                Full Name
                              </label>
                              <input
                                id="name"
                                type="text"
                                value={userFormData.name}
                                onChange={(e) =>
                                  setUserFormData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                placeholder="Enter full name"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="email"
                                className="text-sm font-medium"
                              >
                                Email Address
                              </label>
                              <input
                                id="email"
                                type="email"
                                value={userFormData.email}
                                onChange={(e) =>
                                  setUserFormData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                placeholder="Enter email address"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="role"
                                className="text-sm font-medium"
                              >
                                Role
                              </label>
                              <select
                                id="role"
                                value={userFormData.role}
                                onChange={(e) =>
                                  setUserFormData((prev) => ({
                                    ...prev,
                                    role: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                              >
                                <option value="User">User</option>
                                <option value="Moderator">Moderator</option>
                                <option value="Admin">Admin</option>
                              </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setUserFormOpen(false)}
                                disabled={userFormLoading}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" disabled={userFormLoading}>
                                {userFormLoading ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                  </>
                                ) : (
                                  'Create User'
                                )}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={
                                dashboardData?.users &&
                                selectedUsers.length ===
                                  dashboardData.users.length &&
                                dashboardData.users.length > 0
                              }
                              onCheckedChange={(checked) => {
                                if (checked && dashboardData?.users) {
                                  setSelectedUsers(
                                    dashboardData.users.map((user) => user.id)
                                  );
                                } else {
                                  setSelectedUsers([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dashboardData?.users?.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedUsers((prev) => [
                                      ...prev,
                                      user.id,
                                    ]);
                                  } else {
                                    setSelectedUsers((prev) =>
                                      prev.filter((id) => id !== user.id)
                                    );
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.role === 'Admin'
                                    ? 'default'
                                    : user.role === 'Moderator'
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.status === 'Active'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.lastLogin
                                ? new Date(user.lastLogin).toLocaleDateString()
                                : 'Never'}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Edit User Dialog */}
              <Dialog
                open={editUserFormOpen}
                onOpenChange={setEditUserFormOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                      Update user information and permissions.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpdateUser} className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="edit-name"
                        className="text-sm font-medium"
                      >
                        Full Name
                      </label>
                      <input
                        id="edit-name"
                        type="text"
                        value={editUserFormData.name}
                        onChange={(e) =>
                          setEditUserFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="edit-email"
                        className="text-sm font-medium"
                      >
                        Email Address
                      </label>
                      <input
                        id="edit-email"
                        type="email"
                        value={editUserFormData.email}
                        onChange={(e) =>
                          setEditUserFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="edit-role"
                        className="text-sm font-medium"
                      >
                        Role
                      </label>
                      <select
                        id="edit-role"
                        value={editUserFormData.role}
                        onChange={(e) =>
                          setEditUserFormData((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option value="User">User</option>
                        <option value="Moderator">Moderator</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditUserFormOpen(false)}
                        disabled={editUserFormLoading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={editUserFormLoading}>
                        {editUserFormLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update User'
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* System Alerts */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>System Alerts</CardTitle>
                      <CardDescription>
                        Monitor and resolve system alerts and notifications
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={fetchAlerts}
                      disabled={alertsLoading}
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-2 ${
                          alertsLoading ? 'animate-spin' : ''
                        }`}
                      />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No active alerts
                      </div>
                    ) : (
                      alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`flex items-start gap-4 p-4 rounded-lg border ${
                            alert.resolved
                              ? 'bg-green-50 border-green-200'
                              : alert.type === 'error'
                              ? 'bg-red-50 border-red-200'
                              : alert.type === 'warning'
                              ? 'bg-orange-50 border-orange-200'
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(alert.timestamp).toLocaleString()}
                              {alert.resolved && alert.resolvedAt && (
                                <span className="ml-2">
                                  • Resolved{' '}
                                  {new Date(alert.resolvedAt).toLocaleString()}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                alert.resolved
                                  ? 'secondary'
                                  : alert.type === 'error'
                                  ? 'destructive'
                                  : alert.type === 'warning'
                                  ? 'outline'
                                  : 'default'
                              }
                            >
                              {alert.resolved ? 'Resolved' : alert.type}
                            </Badge>
                            {!alert.resolved && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleResolveAlert(alert.id, true)
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Resolve
                              </Button>
                            )}
                            {alert.resolved && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleResolveAlert(alert.id, false)
                                }
                              >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Reopen
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Audit Logs */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Audit Logs</CardTitle>
                      <CardDescription>
                        Track all administrative actions and system events
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={fetchAuditLogs}
                      disabled={auditLogsLoading}
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-2 ${
                          auditLogsLoading ? 'animate-spin' : ''
                        }`}
                      />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Resource</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditLogs.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-muted-foreground"
                            >
                              No audit logs available
                            </TableCell>
                          </TableRow>
                        ) : (
                          auditLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell className="font-medium">
                                {log.action}
                              </TableCell>
                              <TableCell>
                                {log.resource}
                                {log.resourceId && (
                                  <span className="text-sm text-muted-foreground ml-1">
                                    ({log.resourceId})
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {log.userId ? (
                                  <Badge variant="outline">{log.userId}</Badge>
                                ) : (
                                  <span className="text-muted-foreground">
                                    System
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {log.details ? (
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                ) : (
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 flex justify-end">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Admin Task
                </Button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
