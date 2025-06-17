import {
  BookOpen,
  ChartBar,
  FilePlus2Icon,
  GalleryVerticalEnd,
  PackageSearch,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Create Products",
    url: "/admin/dashboard",
    icon: FilePlus2Icon,
  },
  {
    title: "All Products",
    url: "/admin/dashboard/all-products",
    icon: GalleryVerticalEnd,
  },
  {
    title: "Orders",
    url: "/admin/dashboard/orders",
    icon: PackageSearch,
  },
  {
    title: "Analytics",
    url: "/admin/dashboard/analytics",
    icon: ChartBar,
  },
  {
    title: "Settings",
    url: "/admin/dashboard/settings",
    icon: Settings,
  },
];

const UserSidebar = () => {
  const { pathname } = useLocation();
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center gap-3">
        <BookOpen className="text-customblue" />
        <h3 className="text-xl font-bold">BooksNest</h3>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`${
                    pathname === item.url && "bg-zinc-200 dark:bg-zinc-600"
                  }`}
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <Button className="cursor-pointer">Logout</Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default UserSidebar;
