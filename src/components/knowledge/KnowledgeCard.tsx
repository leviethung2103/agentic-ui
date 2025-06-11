'use client'
import Icon from '@/components/ui/icon'
import { cn } from '@/lib/utils'

interface KnowledgeItem {
  id: string
  title: string
  description: string
  icon: string
}

interface KnowledgeCardProps {
  item: KnowledgeItem
}

const KnowledgeCard = ({ item }: KnowledgeCardProps) => {
  return (
    <div className="group relative cursor-pointer rounded-xl border border-border bg-background-secondary p-4 transition-all duration-200 hover:border-primary/20 hover:bg-background-secondary/80 hover:shadow-lg">
      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
            <Icon type="file-text" size="xs" className="text-brand" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 line-clamp-2 text-sm font-medium text-primary group-hover:text-primary">
            {item.title}
          </h3>
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
