"use client"

import { useState } from "react"
import type { Document } from "@/types/document"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { FileText, Share2, Trash2, Lock, Globe, Calendar, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DocumentItemProps {
    document: Document
    onUpdate: (document: Document) => void
    onDelete: (id: string) => void
}

export default function DocumentItem({ document, onUpdate, onDelete }: DocumentItemProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const handlePermissionChange = async (permission: "public" | "private") => {
        setIsUpdating(true)
        try {
            const response = await fetch(`/api/knowledge-base/documents/${document.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ permission }),
            })
            if (!response.ok) throw new Error("Failed to update permission")
            const updatedDocument = await response.json()
            onUpdate(updatedDocument)
            toast.success("Permission updated successfully.")
        } catch (error) {
            toast.error("Failed to update permission.")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch(`/api/knowledge-base/documents/${document.id}`, {
                method: "DELETE",
            })
            if (!response.ok) throw new Error("Failed to delete document")
            onDelete(document.id)
            toast.success("Document deleted successfully.")
        } catch (error) {
            toast.error("Failed to delete document.")
            setIsDeleting(false)
        }
    }

    const handleShare = () => {
        const shareableLink = `${window.location.origin}/documents/${document.id}`
        navigator.clipboard.writeText(shareableLink)
        toast.success("Shareable link copied to clipboard!")
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const getFileIcon = (name: string) => {
        const extension = name.split(".").pop()?.toLowerCase()
        return <FileText className="h-5 w-5 text-brand" />
    }

    return (
        <Card className="bg-background-secondary border-border p-6 hover:border-brand/30 transition-all duration-200">
            <div className="flex items-start justify-between">
                {/* Document Info */}
                <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 bg-accent rounded-lg">{getFileIcon(document.name)}</div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-primary font-semibold truncate">{document.name}</h3>
                            <Badge
                                variant={document.permission === "public" ? "default" : "secondary"}
                                className={`text-xs ${document.permission === "public"
                                    ? "bg-positive/10 text-positive border-positive/20"
                                    : "bg-muted/10 text-muted border-muted/20"
                                    }`}
                            >
                                {document.permission === "public" ? (
                                    <>
                                        <Globe className="h-3 w-3 mr-1" />
                                        Public
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-3 w-3 mr-1" />
                                        Private
                                    </>
                                )}
                            </Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted">
                            <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Uploaded {formatDate(document.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                    {/* Permission Selector */}
                    <Select value={document.permission} onValueChange={handlePermissionChange} disabled={isUpdating}>
                        <SelectTrigger className="w-[120px] bg-background border-border">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="private">
                                <div className="flex items-center space-x-2">
                                    <Lock className="h-3 w-3" />
                                    <span>Private</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="public">
                                <div className="flex items-center space-x-2">
                                    <Globe className="h-3 w-3" />
                                    <span>Public</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Share Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        disabled={document.permission === "private"}
                        className="border-border hover:border-brand/50 bg-transparent"
                    >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                    </Button>

                    {/* More Actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background-secondary border-border">
                            <DropdownMenuItem
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {isDeleting ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Card>
    )
}
