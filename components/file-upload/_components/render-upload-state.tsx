import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, XIcon } from "lucide-react";

export default function RenderUploadState({ previewUrl, isDeleting, handleRemoveFile }: {
    previewUrl: string,
    isDeleting: boolean,
    handleRemoveFile: () => void
}) {
    return (
        <div>
            <Image src={previewUrl} alt="Uploaded File" fill className="object-contain p-2"/>
            <Button
                variant="destructive"
                size="icon"
                className={cn("absolute top-4 right-4")}
                onClick={handleRemoveFile}
                disabled={isDeleting}
            >
                {isDeleting ? (
                    <Loader2 className="size-4 animate-spin"/>
                ) : (
                    <XIcon className="size-4"/>
                )}
            </Button>
        </div>
    )
}