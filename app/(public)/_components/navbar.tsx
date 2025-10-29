import Image from "next/image";
import Link from "next/link";
import logo from "@/public/vercel.svg";

export default function Navbar(){
    return( 
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
            <div>
                <Link href="/">
                    <Image src={logo} alt="Logo" className="size-9"/>
                    <span>LMS Platform</span>
                </Link>
            </div>
        </header>
    );
}