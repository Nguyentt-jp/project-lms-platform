import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function CoursePage(){    
    return(
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Your Courses</h1>
                <Link className={buttonVariants()} href="/admin/course/create">Create Course</Link>
            </div>
        </>
    );
}