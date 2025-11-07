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

    async function uploadFile( file: File ) {
        setFileState(( prevState ) => ({
            ...prevState,
            uploading: true,
            progress: 0,
        }));

        try {
            // Get presigner URL
            const presignedResponse = await fetch("/api/s3-storage/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true,
                }),
            });

            console.log(presignedResponse)

            if ( !presignedResponse.ok ) {
                toast.error("Failed to get presigned URL");
                setFileState(( prevState ) => ({
                    ...prevState,
                    uploading: false,
                    progress: 0,
                    error: true
                }));

                return;
            }

            const { preSignerURL, key } = await presignedResponse.json();

            await new Promise<void>(( resolve, reject ) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.onprogress = ( event ) => {
                    if ( event.lengthComputable ) {
                        const percentageCompleted = (event.loaded / event.total) * 100;
                        setFileState(( prevState ) => ({
                            ...prevState,
                            progress: Math.round(percentageCompleted)
                        }));
                    }
                }

                xhr.onload = ( event ) => {
                    if ( xhr.status === 200 || xhr.status === 204 ) {
                        setFileState(( prevState ) => ({
                            ...prevState,
                            progress: 100,
                            uploading: false,
                            key: key
                        }));
                        resolve();
                    } else {
                        reject(new Error("Upload failed...."));
                    }
                }

                xhr.onerror = () => {
                    reject(new Error("Upload failed...."));
                }

                xhr.open("PUT", preSignerURL);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file);
            })
        } catch {
            toast.error("Something went wrong!");

            setFileState(( prevState ) => ({
                ...prevState,
                progress: 0,
                uploading: false,
                error: true,
            }));
        }
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

        uploadFile(acceptedFile[0])
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

    function renderContent() {
        if ( fileState.uploading ) {
            return (
                <h1>Uploading...</h1>
            );
        }

        if ( fileState.error ) {
            return(
                <RenderErrorState />
            );
        }

        if ( fileState.objectUrl ){
            return(
                <h1>Uploaded file</h1>
            );
        }

        return(<RenderEmptyState isDragActive={isDragActive}/>);
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
                {renderContent()}
            </CardContent>
        </Card>
    )
}