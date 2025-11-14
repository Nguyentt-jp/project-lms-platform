export default function RenderUploadingState({ progress, file }: { progress: number, file: File }) {
    return (
        <div className="text-center flex justify-center items-center flex-col">
            <p>{progress}</p>
            <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
            <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">{file.name}</p>
        </div>
    )
}