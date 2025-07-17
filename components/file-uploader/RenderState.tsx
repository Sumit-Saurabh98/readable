import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";


export function RenderEmptyState({isDragActive}: {isDragActive: boolean}) {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
                <CloudUploadIcon 
                className={cn(
                    "size-6 text-muted-foreground",
                    isDragActive && "textprimary"
                )}
                 />
            </div>
            <p className="textbase font-semibold text-foreground">Drop your files here or{" "} <span className="text-primary font-bold cursor-pointer">click to upload</span></p>
            <Button type="button" className="mt-4">Select File</Button>
        </div>
    )

}

export function RenderErrorState() {
    return (
        <div className=" text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
                <ImageIcon 
                className={cn(
                    "size-6 text-destructive",
                )}
                 />
            </div>
            <p className="textbase font-semibold">Upload Failed</p>
            <p className="text-xs mt-1 text-muted-foreground">Something went wrong</p>
            <Button type="button" className="mt-4">
                Retry file selection
            </Button>
        </div>
    )
}

export function RenderUploadState({previewUrl, isDeleting, handleRemoveFile, fileType}:{previewUrl: string, isDeleting: boolean, handleRemoveFile: () => void, fileType: "image" | "video"}) {
    return (
        <div className="relative group w-full h-full flex items-center justify-center">
            {
                fileType === "video" ? (
                    <video src={previewUrl} controls className="rounded-md w-full h-full"/>
                ) : (
                    <Image src={previewUrl} alt="Preview" fill className="object-contain p-2" />
                )
            }
            <Button onClick={handleRemoveFile} disabled={isDeleting} type="button" size={"icon"} variant="destructive" className={cn("absolute top-4 right-4")}>
                {
                    isDeleting ? (
                        <Loader2 size={4} className="animate-spin" />
                    ) : (
                        <XIcon className="size-4" />
                    )
                }
            </Button>
        </div>
    )
}

export function RenderUploadingState({progress, file}:{progress: number, file: File}) {
    return (
        <div className="text-center flex flex-col justify-center items-center">
            <p>{progress}</p>
        <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
        <p className="text-sx mt-1 text-muted-foreground truncate max-w-xs">{file.name}</p>
        </div>
    )

}