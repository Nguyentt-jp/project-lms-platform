import { auth } from "@/lib/auth";
import Navbar from "./_components/navbar";
import { headers } from "next/headers";
import { User } from "@/lib/type";
import { redirect } from "next/navigation";
import AuthProvider from "../context/auth-provider";

export default async function PublicLayout({children}:{children: React.ReactNode}){
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
    }else{
        return(
            <div className="">
                <Navbar/>
                <div className="flex flex-col items-center text-center">
                    <main className="container mx-4 px-4 md:px-6 lg:px-8">
                        {children}
                    </main>
                </div>
            </div>
        );
    }    
}