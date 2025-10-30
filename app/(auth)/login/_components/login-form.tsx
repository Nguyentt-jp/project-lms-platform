"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Github, Loader2, Send} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useState, useTransition} from "react";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function LoginForm() {
    const [githubPending, startGithubTransition] = useTransition();
    const [email, setEmail] = useState("");
    const [emailPending, startEmailTransition] = useTransition();
    const router = useRouter();

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

    function handleSignInWithEmail(){
        startEmailTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: "sign-in",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Verification email sent!");
                        router.push(`/verify-request?email=${email}`);
                    },
                    onError: (error) => {
                        toast.error("Internal service error!");
                    }
                }
            })
        })
    }

    return(
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Welcome Back!</CardTitle>
                <CardDescription>Login with your Github or Email Account</CardDescription>
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
                        <Input
                            value={email}
                            onChange={(e) => (setEmail(e.target.value))}
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <Button
                        onClick={handleSignInWithEmail}
                        disabled={emailPending}
                        className="w-full">
                        {emailPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin"/>
                                <span>Loading...</span>
                            </>
                        ):(
                            <>
                                <Send className="size-4"></Send>
                                <span>Continue with Email</span>
                            </>
                        )}

                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}