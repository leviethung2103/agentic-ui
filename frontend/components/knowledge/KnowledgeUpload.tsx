"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Progress } from "../ui/progress"

const SUPPORTED_FILE_TYPES = [".pdf", ".docx", ".txt", ".md", ".csv", ".xlsx", ".pptx", ".html"]

interface KnowledgeUploadProps {
  onCancel: () => void
  onUpload: (files: File[]) => Promise<void>
}

export default function KnowledgeUpload({ onCancel, onUpload }: KnowledgeUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFiles = (selectedFiles: File[]) => {
    setError(null)
    const invalidFiles = selectedFiles.filter((file) => {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
      return fileExtension && !SUPPORTED_FILE_TYPES.includes(fileExtension)
    })

    if (invalidFiles.length > 0) {
      setError(
        `Unsupported file types: ${invalidFiles.map((f) => f.name).join(", ")}. Supported formats: ${SUPPORTED_FILE_TYPES.join(", ")}`,
      )
      return
    }

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      await onUpload(files)
      setUploadProgress(100)

      // Show success state briefly before closing
      setTimeout(() => {
        clearInterval(progressInterval)
      }, 500)
    } catch (err) {
      setError("Failed to upload files. Please try again.")
      console.error("Upload error:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    setError(null)
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "pdf":
        return "📄"
      case "docx":
      case "doc":
        return "📝"
      case "xlsx":
      case "xls":
        return "📊"
      case "pptx":
      case "ppt":
        return "📋"
      case "txt":
      case "md":
        return "📃"
      default:
        return "📄"
    }
  }

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="modal-content w-full max-w-2xl border border-border/50 bg-background shadow-2xl">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-background/80">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Add New Knowledge</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Upload documents to expand your knowledge base</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0 hover:bg-muted/50">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${dragActive
                  ? "border-brand bg-brand/10 scale-105"
                  : files.length > 0
                    ? "border-brand/50 bg-brand/5 hover:bg-brand/10"
                    : "border-border/50 bg-muted/10 hover:bg-muted/20 hover:border-muted-foreground/50"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div
                className={`rounded-full p-4 mb-4 transition-all duration-300 ${dragActive ? "bg-brand/20 scale-110" : files.length > 0 ? "bg-brand/10" : "bg-muted/20"
                  }`}
              >
                <Upload
                  className={`h-10 w-10 transition-colors duration-300 ${dragActive ? "text-brand" : files.length > 0 ? "text-brand" : "text-muted-foreground"
                    }`}
                />
              </div>

              <h3 className="text-lg font-medium text-foreground mb-2">
                {dragActive
                  ? "Drop files here"
                  : files.length > 0
                    ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                    : "Drag and drop files here"}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                or click to browse • Supported: {SUPPORTED_FILE_TYPES.join(", ")}
              </p>

              <Button type="button" variant="outline" className="btn-hover-lift">
                <FileText className="mr-2 h-4 w-4" />
                Choose Files
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={SUPPORTED_FILE_TYPES.join(",")}
                multiple
              />
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="animate-slide-in-up space-y-3 rounded-xl border border-border/50 bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading files...</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Selected Files */}
            {files.length > 0 && !isUploading && (
              <div className="animate-slide-in-up space-y-3 rounded-xl border border-border/50 bg-muted/5 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">Selected Files ({files.length})</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiles([])}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="animate-fade-in flex items-center justify-between rounded-lg border border-border/30 bg-background p-3 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="text-2xl mr-3">{getFileIcon(file.name)}</div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{(file.size / 1024).toFixed(1)} KB</span>
                            <span>•</span>
                            <span className="capitalize">{file.name.split(".").pop()} file</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-2"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="animate-slide-in-up flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {uploadProgress === 100 && (
              <div className="animate-slide-in-up flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-700">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">Files uploaded successfully!</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 border-t border-border/50 pt-6 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isUploading}
              className="btn-hover-lift"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={files.length === 0 || isUploading}
              className="btn-hover-lift bg-gradient-to-r from-brand to-primary text-white shadow-lg disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload {files.length} File{files.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
