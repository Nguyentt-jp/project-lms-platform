import { CloudUploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function RenderEmptyState( { isDragActive }: { isDragActive: boolean } ) {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
                <CloudUploadIcon
                    className={cn(
                        "size-6 text-muted-foreground",
                        isDragActive && "text-primary")}
                />
            </div>
            <p className="text-base font-semibold text-foreground">
                Drop your file here or
                <span className="text-primary font-bold cursor-pointer"> Click to upload!</span>
            </p>
            <Button type="button" className="mt-4">Select File</Button>
        </div>
    )
}

