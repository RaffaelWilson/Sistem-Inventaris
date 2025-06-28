
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Folder, LayoutGrid, LayoutList, History, ArrowLeftRight, SquareUserRound, UserRoundPen } from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';
import { NavUser } from './nav-user';


export function AppSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const isAdmin = user?.role === 'admin';

    const mainNavItems: NavItem[] = isAdmin
        ? [
            { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
            { title: 'Management User', href: '/admin/users', icon: Folder },
            { title: 'Management Product', href: '/admin/product-management', icon: Folder },
            { title: 'Management Stok', href: '/admin/stock-management', icon: Folder },
            { title: 'Management Supplier', href: '/admin/supplier-management', icon: Folder },
            { title: 'Purchase Order', href: '/admin/purchase-orders', icon: Folder },
            { title: 'Transaction', href: '/admin/transactions', icon: Folder },
            { title: 'Inventory Logs', href: '/admin/inventory-logs', icon: Folder },
        ]
        : [
            { title: 'List Product', href: '/user/products', icon: LayoutList },
            { title: 'Tranksaksi Penjualan', href: '/user/transactions', icon: ArrowLeftRight  },
            { title: 'Customer', href: '/user/customers', icon: SquareUserRound },
            { title: 'History', href: '/user/transaction-history', icon: History },
            { title: 'My Profile', href: '/user/my-profile', icon: UserRoundPen },
        ];
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
