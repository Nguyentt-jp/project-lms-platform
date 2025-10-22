import React from "react";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {buttonVariants} from "@/components/ui/button";
import Image from "next/image";
import logo from "@/public/vercel.svg"

export default function AuthLayout({children}:{children: React.ReactNode}){
    return(
        <div className="relative flex min-h-svh flex-col items-center justify-center">
            <Link href="/" className={buttonVariants({
                variant: "outline",
                className: "absolute top-4 left-4"
            })} >
                <ArrowLeft className="size-4 "/>
                Back
            </Link>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center justify-center gap-2 font-medium">
                    <Image src={logo} alt="logo" height={32} width={32} />
                    LMS Platform
                </Link>
                {children}
                <div className="text-balance text-center text-xs text-muted-foreground">
                    By clicking continue, you agree to our
                    <span className="hover:text-primary hover:underline"> Terms of service </span>
                    {" "} and
                    <span className="hover:text-primary hover:underline"> Privacy Policy</span>.
                </div>
            </div>
        </div>
    );
}