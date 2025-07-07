import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";


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