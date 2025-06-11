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
  onUpload: (file: File) => Promise<void>
}

export default function KnowledgeUpload({
  onCancel,
  onUpload
}: KnowledgeUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const fileExtension =
        '.' + selectedFile.name.split('.').pop()?.toLowerCase()

      if (fileExtension && !SUPPORTED_FILE_TYPES.includes(fileExtension)) {
        setError(
          `Unsupported file type. Please upload one of: ${SUPPORTED_FILE_TYPES.join(', ')}`
        )
        return
      }

      setFile(selectedFile)
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
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      await onUpload(file)
    } catch (err) {
      setError('Failed to upload file. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setError(null)
    // Reset file input
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
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-12 text-center transition-colors hover:bg-muted/50 ${file ? 'border-brand bg-brand/5' : ''}`}
            onClick={handleDropZoneClick}
          >
            <Upload className="text-muted-foreground mb-4 h-10 w-10" />
            <p className="text-foreground mb-1 text-sm font-medium">
              {file ? file.name : 'Drag and drop files here or click to browse'}
            </p>
            <p className="text-muted-foreground mb-4 text-xs">
              Supported formats: {SUPPORTED_FILE_TYPES.join(', ')}
            </p>
            <Button type="button" variant="outline" onClick={handleButtonClick}>
              Select File
            </Button>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={SUPPORTED_FILE_TYPES.join(',')}
            />
            {file && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
              >
                <X className="mr-1 h-4 w-4" /> Remove File
              </Button>
            )}
          </div>

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
              disabled={!file || isUploading}
              className="bg-brand text-white hover:bg-brand/90"
            >
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload File'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
