"use client"
import Icon from "@/components/ui/icon"
import { cn } from "@/lib/utils"

interface KnowledgeItem {
  id: string
  title: string
  type: "CHATFLOW" | "WORKFLOW" | "AGENT"
  description: string
  icon: string
}

interface KnowledgeCardProps {
  item: KnowledgeItem
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "CHATFLOW":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "WORKFLOW":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20"
    case "AGENT":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "CHATFLOW":
      return "agent"
    case "WORKFLOW":
      return "hammer"
    case "AGENT":
      return "agent"
    default:
      return "agent"
  }
}

const KnowledgeCard = ({ item }: KnowledgeCardProps) => {
  return (
    <div className="group relative cursor-pointer rounded-xl border border-border bg-background-secondary p-4 transition-all duration-200 hover:border-primary/20 hover:bg-background-secondary/80 hover:shadow-lg">
      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
            <Icon type={getTypeIcon(item.type) as any} size="xs" className="text-brand" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 line-clamp-2 text-sm font-medium text-primary group-hover:text-primary">{item.title}</h3>
          <div
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
              getTypeColor(item.type),
            )}
          >
            {item.type}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="line-clamp-3 text-xs text-muted">{item.description}</p>

      {/* Hover overlay */}
      <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </div>
  )
}

export default KnowledgeCard
