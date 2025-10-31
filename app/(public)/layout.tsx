import { auth } from "@/lib/auth";
import Navbar from "./_components/navbar";
import { headers } from "next/headers";
import { User } from "@/lib/type";
import AuthProvider from "../context/auth-provider";

export default async function PublicLayout({children}:{children: React.ReactNode}){
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userInfo: User | null = session ? {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image || ""
        } : null;
        	
    return(
    <AuthProvider session={userInfo}>
        <div className="">
            <Navbar/>
            <div className="flex flex-col items-center text-center">
                <main className="container mx-4 px-4 md:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    </AuthProvider>
    );	       
}