"use client";

import { FileRejection, useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import RenderEmptyState from "@/components/file-upload/render-empty-state";
import RenderErrorState from "@/components/file-upload/render-error-state";
import { toast } from "sonner";
import { UploadState } from "@/lib/type";
import { v4 as uuidv4 } from "uuid";

export default function Uploader() {

    const [ fileState, setFileState ] = useState<UploadState>({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        fileType: "image",
    });

    function uploadFile( file: File ) {
        setFileState(( prevState ) => ({
            ...prevState,
            uploading: true,
            progress: 0,
        }));
    }

    const onDrop = useCallback(( acceptedFile: File[] ) => {

        if ( acceptedFile.length ) {
            setFileState({
                id: uuidv4(),
                file: acceptedFile[0],
                progress: 0,
                uploading: false,
                error: false,
                isDeleting: false,
                fileType: "image",
                objectUrl: URL.createObjectURL(acceptedFile[0])
            })
        }
    }, []);

    function rejectFile( fileRejections: FileRejection[] ) {
        if ( fileRejections.length ) {
            const toManyFiles = fileRejections.find(( rejection ) => {
                rejection.errors[0].code === "too-many-files"
            })

            const toMaxSizeFiles = fileRejections.find(( rejection ) => {
                rejection.errors[0].code === "file-too-large"
            })

            if ( toMaxSizeFiles ) {
                toast.error("File size exceed the limit!")
            }

            if ( toManyFiles ) {
                toast.error("Too many files selected, max is 1!")
            }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024,
        onDropRejected: rejectFile,
    })
    return (
        <Card {...getRootProps()} className={cn(
            "relative  border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
            isDragActive ?
                "border-primary bg-primary/10 border-solid" :
                "border-border hover:border-primary"
        )}>
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                {
                    <RenderEmptyState isDragActive={isDragActive}/>
                    //<RenderErrorState/>
                }
            </CardContent>
        </Card>
    )
}