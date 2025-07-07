"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState, RenderUploadingState, RenderUploadState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

export default function Uploader() {
  const [fileState, setFilesState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: "image",
  });

  async function uploadFile(file: File) {
    setFilesState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      // get pre-signed url

      const preSignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!preSignedResponse.ok) {
        toast.error("Failed to get pre-signed url.");
        setFilesState((prev) => ({
          ...prev,
          uploading: false,
          error: true,
          progress: 0,
        }));

        return;
      }

      const { preSignedUrl, key } = await preSignedResponse.json();

      // upload file to s3

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentageCompleted = Math.round(
              (event.loaded / event.total) * 100
            );
            setFilesState((prev) => ({
              ...prev,
              progress: percentageCompleted,
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            setFilesState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key: key,
            }));
            toast.success("File uploaded successfully");
            resolve();
          } else {
              reject(new Error("File upload failed"));
          }
        };

        xhr.onerror = () => {
          reject(new Error("File upload failed"));
        };

        xhr.open("PUT", preSignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      toast.error("File upload failed");
      setFilesState((prev) => ({
        ...prev,
        uploading: false,
        error: true,
        progress: 0,
      }));
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")){
          URL.revokeObjectURL(fileState.objectUrl);
      }

      setFilesState({
        file: file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: "image",
      });

      uploadFile(file);
    }
  }, [fileState.objectUrl]);

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );

      const fileSizeTooBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (fileSizeTooBig) {
        toast.error("File size is too large limit is 5mb");
      }

      if (tooManyFiles) {
        toast.error("Only one file is allowed at a time");
      }
    }
  }

  function renderContent(){
    if(fileState.uploading){
        return <RenderUploadingState progress={fileState.progress} file={fileState.file!} />;
    }

    if(fileState.error){
        return <RenderErrorState />;
    }

    if(fileState.objectUrl){
        return (
            <RenderUploadState previewUrl={fileState.objectUrl} />
        )
    }

    return <RenderEmptyState isDragActive={false} />
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5 mb
    onDropRejected: rejectedFiles,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
