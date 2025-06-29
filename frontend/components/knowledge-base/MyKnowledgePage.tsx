"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSession } from "next-auth/react"
import FileUpload from "@/components/knowledge-base/FileUpload"
import type { Document } from "@/types/document"
import { useRouter } from "next/navigation"
import Heading from '@/components/ui/typography/Heading'
import Paragraph from '@/components/ui/typography/Paragraph'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Search, Upload, MoreHorizontal, FileText, ImageIcon, Video, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import Tooltip from '@/components/ui/tooltip'

const fileTypeColors = {
    document: "bg-blue-500",
    image: "bg-pink-500",
    video: "bg-purple-500",
    audio: "bg-green-500",
    zip: "bg-red-500",
}

function getFileTypeIcon(name: string) {
    const ext = name.split('.').pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext || "")) return <ImageIcon className="w-4 h-4" />
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext || "")) return <Video className="w-4 h-4" />
    // Add more types as needed
    return <FileText className="w-4 h-4" />
}

function getFileType(name: string): keyof typeof fileTypeColors {
    const ext = name.split('.').pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(ext || "")) return "image"
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext || "")) return "video"
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext || "")) return "zip"
    // Add more types as needed
    return "document"
}

export default function MyKnowledgePageComponent() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [documents, setDocuments] = useState<Document[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [fileTypeFilter, setFileTypeFilter] = useState<string>("all")

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
        }
    }, [status, router])

    useEffect(() => {
        if (session) {
            fetch("/api/knowledge-base/documents")
                .then((res) => res.json())
                .then((data) => {
                    setDocuments(data)
                    setIsLoading(false)
                })
                .catch(() => setIsLoading(false))
        } else {
            setIsLoading(false)
        }
    }, [session, status])

    const onUploadComplete = (newDocument: Document) => {
        setDocuments((prev) => [newDocument, ...prev])
    }

    const handleDocumentUpdate = (updatedDocument: Document) => {
        setDocuments((docs) => docs.map((d) => (d.id === updatedDocument.id ? updatedDocument : d)))
    }

    const handleDocumentDelete = async (documentId: string) => {
        try {
            const response = await fetch(`/api/knowledge-base/documents/${documentId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete document");
            setDocuments((docs) => docs.filter((d) => d.id !== documentId));
            // Optionally show a toast here for success
        } catch (error) {
            // Optionally show a toast here for error
            console.error(error);
        }
    };

    // Filtering and pagination logic
    const filteredFiles = useMemo(() => {
        return documents.filter((file) => {
            const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesType = fileTypeFilter === "all" || getFileType(file.name) === fileTypeFilter
            return matchesSearch && matchesType
        })
    }, [documents, searchQuery, fileTypeFilter])

    const totalPages = Math.ceil(filteredFiles.length / rowsPerPage)
    const startIndex = (currentPage - 1) * rowsPerPage
    const paginatedFiles = filteredFiles.slice(startIndex, startIndex + rowsPerPage)

    const handleFileSelect = (fileId: string, checked: boolean) => {
        if (checked) {
            setSelectedFiles([...selectedFiles, fileId])
        } else {
            setSelectedFiles(selectedFiles.filter((id) => id !== fileId))
        }
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedFiles(paginatedFiles.map((file) => file.id))
        } else {
            setSelectedFiles([])
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        setSelectedFiles([])
    }

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number.parseInt(value))
        setCurrentPage(1)
        setSelectedFiles([])
    }

    const formatFileSize = (bytes: number) => {
        if (!bytes || bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-brand border-t-transparent"></div>
                    <Paragraph className="text-muted">Loading your knowledge base...</Paragraph>
                </div>
            </div>
        )
    }

    // Recently uploaded: just show the 3 most recent
    const recentFiles = documents.slice(0, 3)

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#111113', color: 'white' }}>
            <div className="max-w-7xl mx-auto p-6">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">My Knowledge Base</h1>
                    <p className="text-gray-400">
                        Upload and manage your documents. Share knowledge with your team or keep it private for personal use.
                    </p>
                </div>

                {/* Recently Uploaded */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Recently uploaded</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentFiles.map((file) => (
                            <Card key={file.id} className="" style={{ backgroundColor: '#1B1B1C', borderColor: '#232325' }}>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded ${fileTypeColors[getFileType(file.name)]} text-white`}>
                                            {getFileTypeIcon(file.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Tooltip content={file.name}>
                                                <p
                                                    className="text-sm font-medium text-white cursor-pointer"
                                                    style={{
                                                        maxWidth: 180,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        display: 'block',
                                                    }}
                                                >
                                                    {file.name}
                                                </p>
                                            </Tooltip>
                                            <p className="text-xs text-gray-400">
                                                {file.userId} • {getFileType(file.name)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* All Files Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Your Documents</h2>
                            <p className="text-gray-400">{documents.length} documents</p>
                        </div>
                        <Button onClick={() => setUploadModalOpen(true)} className="bg-red-600 hover:bg-red-700">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload file
                        </Button>
                    </div>

                    {/* Search Row */}
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search files..."
                                className="pl-10 text-white placeholder-gray-400"
                                style={{ backgroundColor: '#1B1B1C', borderColor: '#232325' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                            <SelectTrigger className="w-32 text-white" style={{ backgroundColor: '#1B1B1C', borderColor: '#232325' }}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="" style={{ backgroundColor: '#1B1B1C', borderColor: '#232325' }}>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="document">Documents</SelectItem>
                                <SelectItem value="image">Images</SelectItem>
                                <SelectItem value="video">Videos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="text-sm text-gray-400 mb-4">
                        Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredFiles.length)} of {filteredFiles.length} files
                    </div>

                    {/* Files Table */}
                    {filteredFiles.length > 0 ? (
                        <>
                            <div className="rounded-lg border mb-4" style={{ backgroundColor: '#1B1B1C', borderColor: '#232325' }}>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow style={{ backgroundColor: '#232325', borderColor: '#232325' }}>
                                                <TableHead className="px-6 py-3 text-left">
                                                    <Checkbox
                                                        checked={selectedFiles.length === paginatedFiles.length && paginatedFiles.length > 0}
                                                        onCheckedChange={handleSelectAll}
                                                    />
                                                </TableHead>
                                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Name
                                                </TableHead>
                                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Owner
                                                </TableHead>
                                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Size
                                                </TableHead>
                                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Date modified
                                                </TableHead>
                                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedFiles.map((file) => (
                                                <TableRow key={file.id} style={{ backgroundColor: '#1B1B1C' }} className="hover:bg-[#232325]">
                                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                                        <Checkbox
                                                            checked={selectedFiles.includes(file.id)}
                                                            onCheckedChange={(checked) => handleFileSelect(file.id, checked as boolean)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className={`p-2 rounded mr-3 ${fileTypeColors[getFileType(file.name)]} text-white`} style={{ backgroundColor: '#232325' }}>
                                                                {getFileTypeIcon(file.name)}
                                                            </div>
                                                            <Tooltip content={file.name}>
                                                                <div
                                                                    className="text-sm font-medium text-white cursor-pointer"
                                                                    style={{
                                                                        maxWidth: 220,
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                        display: 'block',
                                                                    }}
                                                                >
                                                                    {file.name}
                                                                </div>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{file.ownerName || '-'}</TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatFileSize(file.size)}</TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{file.createdAt ? new Date(file.createdAt).toLocaleDateString() : '-'}</TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" style={{ backgroundColor: '#1B1B1C', borderColor: '#232325' }}>
                                                                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                                                                    Download
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                                                                    Share
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                                                                    Rename
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                                                                    onClick={() => handleDocumentDelete(file.id)}
                                                                >
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-400">Rows per page:</span>
                                    <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
                                        <SelectTrigger className="w-20 text-white" style={{ backgroundColor: '#1B1B1C', borderColor: '#232325' }}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent style={{ backgroundColor: '#1B1B1C', borderColor: '#232325' }}>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="text-gray-400 hover:text-white disabled:opacity-50"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Prev
                                    </Button>

                                    <span className="text-sm text-gray-400">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="text-gray-400 hover:text-white disabled:opacity-50"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Card style={{ backgroundColor: '#1B1B1C', borderColor: '#232325' }}>
                            <CardContent className="p-12 text-center">
                                <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No documents yet</h3>
                                <p className="text-gray-400 mb-2">Upload your first document to start building your knowledge base.</p>
                                <p className="text-gray-500 text-sm">You can share documents with others or keep them private.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                <DialogContent className="text-white" style={{ backgroundColor: '#1B1B1C', borderColor: '#232325', maxWidth: 640, width: '100%' }}>
                    <DialogHeader>
                        <DialogTitle className="text-white">Upload file</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400">
                            Drag and drop your files here or click to browse. Supports PDF and TXT files up to 10MB.
                        </p>
                        <FileUpload onUploadComplete={(doc) => { setUploadModalOpen(false); onUploadComplete(doc); }} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
