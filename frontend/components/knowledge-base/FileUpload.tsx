"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import Heading from '@/components/ui/typography/Heading'
import Paragraph from '@/components/ui/typography/Paragraph'
import Tooltip from '@/components/ui/tooltip'

interface FileUploadProps {
    onUploadComplete: (document: any) => void
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)

    const handleFileChange = (selectedFiles: FileList | File[]) => {
        const validFiles: File[] = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            if (file.type === "application/pdf" || file.type === "text/plain") {
                validFiles.push(file);
            }
        }
        if (validFiles.length > 0) {
            setFiles(validFiles);
            setError(null);
        } else {
            setError("Only PDF and TXT files are allowed.");
            setFiles([]);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileChange(e.target.files);
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.length) {
            setError("Please select at least one file to upload.");
            return;
        }

        setUploading(true);
        setProgress(0);
        setError(null);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await axios.post("/api/knowledge-base/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                },
            });
            // If backend returns an array of documents, call onUploadComplete for each
            if (Array.isArray(response.data)) {
                response.data.forEach(onUploadComplete);
            } else {
                onUploadComplete(response.data);
            }
            setFiles([]);
            toast.success("Documents uploaded successfully!");
        } catch (err: any) {
            let message = "Upload failed. Please try again.";
            if (err.response && err.response.data && err.response.data.error) {
                message = err.response.data.error;
            }
            setError(message);
            toast.error(message);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <Card className="bg-background-secondary border-border p-6">
            <div className="mb-4">
                <Heading size={3} className="text-primary mb-2">
                    Upload Document
                </Heading>
                <Paragraph className="text-muted text-sm">
                    Drag and drop your files here or click to browse. Supports PDF and TXT files up to 10MB.
                </Paragraph>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Drag and Drop Area */}
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive ? "border-brand bg-brand/5" : "border-border hover:border-brand/50 hover:bg-brand/5"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        multiple
                        onChange={handleInputChange}
                        accept=".pdf,.txt"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                    />

                    <div className="flex flex-col items-center space-y-3">
                        <div className="p-3 bg-accent rounded-full">
                            <Upload className="h-6 w-6 text-brand" />
                        </div>

                        {files.length > 0 ? (
                            <div className="flex flex-col items-center space-y-1 text-primary w-full">
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 w-full">
                                        <FileText className="h-4 w-4" />
                                        <Tooltip content={file.name}>
                                            <span
                                                className="font-medium cursor-pointer block"
                                                style={{
                                                    maxWidth: 350,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    display: 'block',
                                                }}
                                            >
                                                {file.name}
                                            </span>
                                        </Tooltip>
                                        <span className="text-muted text-sm">({formatFileSize(file.size)})</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <Paragraph className="text-primary font-medium">
                                    Drop your files here, or <span className="text-brand">browse</span>
                                </Paragraph>
                                <Paragraph className="text-muted text-sm">PDF, TXT files only</Paragraph>
                            </>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                {uploading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted">Uploading...</span>
                            <span className="text-primary">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <Paragraph className="text-destructive text-sm">{error}</Paragraph>
                    </div>
                )}

                {/* Upload Button */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={!files.length || uploading} className="bg-brand hover:bg-brand/90 text-white px-6">
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Document{files.length > 1 ? 's' : ''}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    )
}
