'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X, FileText } from 'lucide-react'

const SUPPORTED_FILE_TYPES = [
  '.pdf',
  '.docx',
  '.txt',
  '.md',
  '.csv',
  '.xlsx',
  '.pptx',
  '.html'
]

interface KnowledgeUploadProps {
  onCancel: () => void
  onUpload: (files: File[]) => Promise<void>
}

export default function KnowledgeUpload({
  onCancel,
  onUpload
}: KnowledgeUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      const invalidFiles = selectedFiles.filter((file) => {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        return fileExtension && !SUPPORTED_FILE_TYPES.includes(fileExtension)
      })

      if (invalidFiles.length > 0) {
        setError(
          `Unsupported file types: ${invalidFiles.map((f) => f.name).join(', ')}. Supported formats: ${SUPPORTED_FILE_TYPES.join(', ')}`
        )
        return
      }

      setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
    }
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const handleDropZoneClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      await onUpload(files)
    } catch (err) {
      setError('Failed to upload files. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    setError(null)
  }

  const clearAllFiles = () => {
    setFiles([])
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="border border-border bg-background">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg font-medium">Add New Knowledge</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-12 text-center transition-colors hover:bg-muted/50 ${files.length > 0 ? 'border-brand bg-brand/5' : ''}`}
            onClick={handleDropZoneClick}
          >
            <Upload className="text-muted-foreground mb-4 h-10 w-10" />
            <p className="text-foreground mb-1 text-sm font-medium">
              {files.length > 0
                ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
                : 'Drag and drop files here or click to browse'}
            </p>
            <p className="text-muted-foreground mb-4 text-xs">
              Supported formats: {SUPPORTED_FILE_TYPES.join(', ')}
            </p>
            <Button type="button" variant="outline" onClick={handleButtonClick}>
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={SUPPORTED_FILE_TYPES.join(',')}
              multiple
            />
            {files.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation()
                  clearAllFiles()
                }}
              >
                <X className="mr-1 h-4 w-4" /> Clear All
              </Button>
            )}
          </div>

          {files.length > 0 && (
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-2"
                >
                  <div className="flex items-center">
                    <FileText className="text-muted-foreground mr-2 h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground h-6 w-6 p-0 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="text-foreground border-border hover:bg-muted/50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={files.length === 0 || isUploading}
              className="bg-brand text-white hover:bg-brand/90"
            >
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
