import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BarChart3, Calendar, CheckSquare, Home, Users, FileText } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Home,
    },
    {
        title: 'Talkshow Management',
        href: '/admin/seminars',
        icon: Calendar,
    },
    {
        title: 'Registrations',
        href: '/admin/registrations',
        icon: Users,
    },
    {
        title: 'Check-in System',
        href: '/admin/checkin',
        icon: CheckSquare,
    },
    // Analytics feature (commented for future implementation)
    /*
    {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
    },
    */
];

const footerNavItems: NavItem[] = [
    {
        title: 'Event Website',
        href: '/',
        icon: Home,
    },
    // Reports feature (commented for future implementation)
    /*
    {
        title: 'Reports',
        href: '/admin/reports',
        icon: FileText,
    },
    */
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
