import Icon from "@/components/ui/icon"

interface KnowledgeCardProps {
    name: string
    description: string
}

export default function KnowledgeCard({ name, description }: KnowledgeCardProps) {
    return (
        <div className="group cursor-pointer rounded-xl border border-border bg-background-secondary p-4 transition-all duration-200 hover:border-primary/20 hover:bg-background-secondary/80">
            <div className="flex items-start gap-3">
                <div className="rounded-lg bg-brand/10 p-2">
                    <Icon type="references" size="xs" className="text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-primary text-sm mb-1 truncate">{name}</h3>
                    <p className="text-xs text-muted line-clamp-2">{description}</p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted">
                    <div className="size-2 rounded-full bg-positive" />
                    <span>Active</span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon type="chevron-down" size="xs" className="text-muted rotate-[-90deg]" />
                </button>
            </div>
        </div>
    )
}
