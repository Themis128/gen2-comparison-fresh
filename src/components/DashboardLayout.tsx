'use client';

import React, { useState } from 'react';

import {
  Home,
  Users,
  Settings,
  BarChart3,
  FileText,
  Mail,
  Calendar,
  ChevronDown,
  Plus,
  Search,
  Bell,
  User,
} from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
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
} from './ui/sidebar';

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '#',
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '#',
  },
  {
    title: 'Users',
    icon: Users,
    href: '#',
  },
  {
    title: 'Documents',
    icon: FileText,
    href: '#',
  },
  {
    title: 'Messages',
    icon: Mail,
    href: '#',
  },
  {
    title: 'Calendar',
    icon: Calendar,
    href: '#',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '#',
  },
];

export const DashboardLayout: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full">
      {sidebarOpen && (
        <Sidebar className="w-64 border-r">
          <SidebarHeader className="border-sidebar-border border-b">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Dashboard</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => setActiveItem(item.title)}
                        isActive={activeItem === item.title}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator />

            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupContent>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <ChevronDown className="h-4 w-4" />
                      <span>Portfolio Website</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton size="sm">
                          <span>Frontend</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton size="sm">
                          <span>Backend</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton size="sm">
                          <span>Testing</span>
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

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${sidebarOpen ? 'rotate-90' : ''}`}
                />
              </Button>
              <h1 className="text-2xl font-semibold">{activeItem}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
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
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,543</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">+3 new this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">12 unread</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
                <CardDescription>Current sprint completion status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Frontend Development</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Backend API</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Testing</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Documentation</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-2 h-2 w-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <p className="text-sm">New user registration</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                    <Badge variant="secondary">User</Badge>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm">Project milestone completed</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                    <Badge variant="default">Project</Badge>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                    <div className="flex-1">
                      <p className="text-sm">System maintenance scheduled</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                    <Badge variant="destructive">System</Badge>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-2 h-2 w-2 rounded-full bg-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm">New feature deployed</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                    <Badge variant="outline">Deploy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-end">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Project
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};
