"use client"
import Icon from "../ui/icon"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

interface KnowledgeItem {
  id: string
  title: string
  description: string
  icon: string
  type?: string
  size?: string
  lastModified?: string
}

interface KnowledgeCardProps {
  item: KnowledgeItem
}

const KnowledgeCard = ({ item }: KnowledgeCardProps) => {
  const getFileTypeColor = (title: string) => {
    if (title.includes(".pdf")) return "bg-red-100 text-red-700 border-red-200"
    if (title.includes(".docx") || title.includes(".doc")) return "bg-blue-100 text-blue-700 border-blue-200"
    if (title.includes(".txt") || title.includes(".md")) return "bg-gray-100 text-gray-700 border-gray-200"
    return "bg-purple-100 text-purple-700 border-purple-200"
  }

  return (
    <div className="knowledge-card group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-background/80 p-6 backdrop-blur-sm hover:border-primary/20 hover:shadow-xl">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-brand/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-primary/20 ring-1 ring-brand/20 transition-all duration-300 group-hover:scale-110 group-hover:ring-brand/40">
              <Icon type="file-text" size="sm" className="text-brand" />
            </div>
            <div className="flex flex-col gap-1">
              <Badge variant="secondary" className={`text-xs font-medium ${getFileTypeColor(item.title)}`}>
                {item.title.includes(".") ? item.title.split(".").pop()?.toUpperCase() : "DOC"}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-muted/80"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <h3 className="mb-3 line-clamp-2 text-base font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground leading-relaxed">{item.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Updated 2 days ago</span>
          <span className="rounded-full bg-muted/50 px-2 py-1">1.2 MB</span>
        </div>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="animate-shimmer absolute inset-0 rounded-2xl" />
      </div>
    </div>
  )
}

export default KnowledgeCard
