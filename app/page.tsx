"use client"

import {ModeToggle} from "@/components/ui/mode-toggle";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export default function Home() {
    /*const session = await auth.api.getSession({
        headers: await headers()
    })*/
    const {data: session} = authClient.useSession();

    const router = useRouter();
    async function handleLogout(){
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                    toast.success("Logged out successfully!");
                },
            },
        });
    }

    return (
        <div>
            <ModeToggle/>
            {session ?
                (
                    <>
                        <h1>{session.user.name}</h1>
                        <h1>{session.user.email}</h1>
                        <Button onClick={handleLogout}>Logout</Button>
                    </>
                ):
                (<Button>Login</Button>)
            }
        </div>
    );
}
