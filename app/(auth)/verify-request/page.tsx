"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "sonner";

export default function VerifyRequest() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [emailPending, startEmailTransition] = useTransition();
    const params = useSearchParams();
    const email = params.get("email") as string;
    const isOtpComplete = otp.length === 6;

    function handleVerifyRequest(){
        startEmailTransition(async () => {
            await authClient.signIn.emailOtp({
                email: email,
                otp: otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Email verified successfully!");
                        router.push("/");
                    },
                    onError: (error) => {
                        toast.error("Verification failed!" + otp);
                    }
                }
            })
        })
    }
    return(
        <Card className="w-full mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Please check your email</CardTitle>
                <CardDescription>We have a verifycation email code to your email address. Please open the email and paste the code below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <InputOTP value={otp} onChange={(value) => (setOtp(value))} maxLength={6} className="gap-2">
                        <InputOTPGroup>
                            <InputOTPSlot index={0}/>
                            <InputOTPSlot index={1}/>
                            <InputOTPSlot index={2}/>
                        </InputOTPGroup>
                        <InputOTPGroup>
                            <InputOTPSlot index={3}/>
                            <InputOTPSlot index={4}/>
                            <InputOTPSlot index={5}/>
                        </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your email</p>
                    <Button onClick={handleVerifyRequest} disabled={emailPending || !isOtpComplete} className="w-full">Verify Request</Button>
                </div>
            </CardContent>
        </Card>
    );
};