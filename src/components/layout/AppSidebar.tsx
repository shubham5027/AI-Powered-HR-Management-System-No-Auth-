
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";

import { 
  BarChart3, 
  Users, 
  UserPlus, 
  ClipboardCheck, 
  Calendar,
  DollarSign, 
  Settings,
  LifeBuoy,
  LogOut,
  FileText,
  MessageSquare,
  Sparkles,
  HeartPulse,
  LineChart,
  BarChart2,
  Network,
  Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AppSidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground">NX</span>
          </div>
          <span className="font-bold text-xl text-sidebar-foreground">NexusHR</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/'}>
                  <Link to="/" className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-3" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/employees'}>
                  <Link to="/employees" className="flex items-center">
                    <Users className="w-4 h-4 mr-3" />
                    <span>Employees</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/recruitment'}>
                  <Link to="/recruitment" className="flex items-center">
                    <UserPlus className="w-4 h-4 mr-3" />
                    <span>Recruitment</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to="/recruitment?tab=candidates&feature=screen">
                        <FileText className="w-4 h-4 mr-2" />
                        <span>AI Screening</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to="/recruitment?tab=candidates&feature=interview">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <span>AI Interviews</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to="/recruitment?tab=candidates&feature=offer">
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span>Offer Letters</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to="/candidate-evaluation">
                        <Globe className="w-4 h-4 mr-2" />
                        <span>Portfolio Evaluation</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/candidate-evaluation'}>
                  <Link to="/candidate-evaluation" className="flex items-center">
                    <Globe className="w-4 h-4 mr-3" />
                    <span>Candidate Evaluation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>HR Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/onboarding'}>
                  <Link to="/onboarding" className="flex items-center">
                    <ClipboardCheck className="w-4 h-4 mr-3" />
                    <span>Onboarding</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/schedules'}>
                  <Link to="/schedules" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span>Schedules</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/payroll'}>
                  <Link to="/payroll" className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-3" />
                    <span>Payroll</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/employee-relations'}>
                  <Link to="/employee-relations" className="flex items-center">
                    <HeartPulse className="w-4 h-4 mr-3" />
                    <span>Employee Relations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/hr-analytics'}>
                  <Link to="/hr-analytics" className="flex items-center">
                    <LineChart className="w-4 h-4 mr-3" />
                    <span>HR Analytics</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to="/hr-analytics?tab=predictive">
                        <BarChart2 className="w-4 h-4 mr-2" />
                        <span>Predictive Analytics</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to="/hr-analytics?tab=org-chart">
                        <Network className="w-4 h-4 mr-2" />
                        <span>Dynamic Org Chart</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/settings'}>
              <Link to="/settings" className="flex items-center">
                <Settings className="w-4 h-4 mr-3" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/support'}>
              <Link to="/support" className="flex items-center">
                <LifeBuoy className="w-4 h-4 mr-3" />
                <span>Help & Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button onClick={logout} className="flex items-center text-red-500 hover:text-red-600 w-full justify-start">
                <LogOut className="w-4 h-4 mr-3" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
