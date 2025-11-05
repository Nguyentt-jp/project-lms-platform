import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function RenderErrorState() {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
                <ImageIcon className={cn("size-6 text-destructive")}/>
            </div>
            <p className="text-base font-semibold">Upload Failed</p>
            <p className="text-sm mt-1 text-muted-foreground">Something went wrong</p>
            <Button type="button" className="mt-4">Retry File Selection</Button>
        </div>
    )
}