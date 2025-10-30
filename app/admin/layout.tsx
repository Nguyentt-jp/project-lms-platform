import { auth } from "@/lib/auth";
import { User } from "@/lib/type";
import { headers } from "next/headers";
import AuthProvider from "../context/auth-provider";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    var userInfo: User

    if (session) {
        userInfo = {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image || ""
        }
        return (
            <AuthProvider value={userInfo}>
                <SidebarProvider
                    style={
                        {
                            "--sidebar-width": "calc(var(--spacing) * 72)",
                            "--header-height": "calc(var(--spacing) * 12)",
                        } as React.CSSProperties
                    }
                >
                    <AppSidebar variant="inset" />
                    <SidebarInset>
                        <SiteHeader />
                        <div className="flex flex-1 flex-col">
                            <div className="@container/main flex flex-1 flex-col gap-2">
                                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 lg:px-4">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </AuthProvider>
        );
    } else {
        return (
            redirect("/login")
        );
    }
}