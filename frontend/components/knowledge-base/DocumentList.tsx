"use client"

import type { Document } from "@/types/document"
import DocumentItem from "./DocumentItem"
import { Card } from "@/components/ui/card"
import { Folder } from "lucide-react"
import Paragraph from '@/components/ui/typography/Paragraph'

interface DocumentListProps {
    documents: Document[]
    onUpdate: (document: Document) => void
    onDelete: (id: string) => void
}

export default function DocumentList({ documents, onUpdate, onDelete }: DocumentListProps) {
    if (documents.length === 0) {
        return (
            <Card className="bg-background-secondary border-border p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-accent rounded-full">
                        <Folder className="h-8 w-8 text-muted" />
                    </div>
                    <div className="space-y-2">
                        <Paragraph className="text-primary font-medium">No documents yet</Paragraph>
                        <Paragraph className="text-muted text-sm max-w-md">
                            Upload your first document to start building your knowledge base. You can share documents with others or
                            keep them private.
                        </Paragraph>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <div className="grid gap-4">
            {documents.map((doc) => (
                <DocumentItem key={doc.id} document={doc} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
        </div>
    )
}
