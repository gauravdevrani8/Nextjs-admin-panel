"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import toast from "react-hot-toast";

interface FileUploadProps {
  value?: string;
  onChange: (url?: string) => void;
  page: string;
}

const FileUpload = ({ value = "", onChange, page }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
        toast.success("Upload successful!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      "video/*": [".mp4", ".mov", ".avi"],
      "application/pdf": [".pdf"],
    },
    maxSize: 500 * 1024 * 1024, // Max 500MB
  });

  return (
    <div className="flex flex-col gap-2">
      {value && (
        page === "Edit Course" ? (
          <Image
            src={value}
            alt="Uploaded file"
            width={500}
            height={500}
            className="w-[280px] h-[200px] object-cover rounded-xl"
          />
        ) : (
          <p className="text-sm font-medium">{value}</p> // Show URL for PDFs/Videos
        )
      )}

      <div
        {...getRootProps()}
        className="w-[280px] h-[200px] border-2 border-dashed flex items-center justify-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {uploading ? <p>Uploading...</p> : <p>Drag & Drop or Click to Upload</p>}
      </div>
    </div>
  );
};

export default FileUpload;
