import { auth } from "@/lib/auth";
import { User } from "@/lib/type";
import { headers } from "next/headers";
import AuthProvider from "../context/auth-provider";
import { redirect } from "next/navigation";

export default async function DashboardLayout({children}: {children: React.ReactNode}){
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    var userInfo: User

    if(session){
        userInfo = {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image || ""
        }
        return(
            <AuthProvider value={userInfo}>
                {children}
            </AuthProvider>
        );
    }else{
        return(
            redirect("/login")
        );
    }
}