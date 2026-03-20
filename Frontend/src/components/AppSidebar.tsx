import { useAuth } from '@/context/AuthContext';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, Upload, BookOpen, LogOut } from 'lucide-react';

const teacherItems = [
  { title: 'Dashboard', url: '/teacher', icon: LayoutDashboard },
  // { title: 'Create Exam', url: '/teacher/create', icon: FileText },
  { title: 'Upload Paper', url: '/teacher/upload', icon: Upload },
];

const studentItems = [
  { title: 'Dashboard', url: '/student', icon: LayoutDashboard },
  { title: 'My Exams', url: '/student', icon: BookOpen },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  const items = user?.role === 'teacher' ? teacherItems : studentItems;
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && (
              <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                {user?.role === 'teacher' ? 'Teacher' : 'Student'}
              </span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {!collapsed && user && (
            <div className="px-3 py-2 text-xs text-sidebar-foreground/40 truncate">
              {user.name}
            </div>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
