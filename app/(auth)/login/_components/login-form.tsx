"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Github} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useTransition} from "react";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";

export default function LoginForm() {
    const [githubPending, startGithubTransition] = useTransition();
    async function handleSignInWithGithub(){
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signed in with github, you will be redirected...");
                    },
                    onError: (error) => {
                        toast.error("Internal service error!");
                    }
                }
            });
        })
    }
    return(
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Welcome Back!</CardTitle>
                <CardDescription>Login with your Github Email Account</CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
                <Button
                    disabled={githubPending}
                    onClick={handleSignInWithGithub}
                    className="w-full"
                    variant="outline">
                    <Github className="size-4"/> Login with Github
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>

                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" placeholder="m@example.com"/>
                    </div>
                    <Button className="w-full">Continue with Email</Button>
                </div>
            </CardContent>
        </Card>
    )
}