"use client"
import { Button } from "../ui/button"
import Icon from "../ui/icon"
import { useState } from "react"
import { cn } from "../../lib/utils"
import { Badge } from "../ui/badge"

type SidebarSection = "knowledge" | "other"

const KnowledgeSidebar = () => {
  const [activeSection, setActiveSection] = useState<SidebarSection>("knowledge")

  const sidebarItems = [
    {
      id: "knowledge" as SidebarSection,
      label: "Knowledge Base",
      icon: "book-open" as const,
      count: 12,
    },
    {
      id: "other" as SidebarSection,
      label: "Analytics",
      icon: "file-text" as const, // Using 'file-text' as an alternative
      count: 0,
    },
  ]

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-border/50 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-border/50 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand/20 to-primary/20 ring-1 ring-brand/20">
              <Icon type="agno" size="xs" className="text-brand" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">KMSLV Knowledge</h2>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start rounded-xl p-4 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                  activeSection === item.id
                    ? "bg-gradient-to-r from-brand/10 to-primary/10 text-brand shadow-sm ring-1 ring-brand/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
                onClick={() => setActiveSection(item.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Icon
                      type={item.icon}
                      size="sm"
                      className={cn(
                        "transition-colors duration-200",
                        activeSection === item.id ? "text-brand" : "text-muted-foreground",
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.count > 0 && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs transition-colors duration-200",
                        activeSection === item.id
                          ? "bg-brand/20 text-brand border-brand/30"
                          : "bg-muted/50 text-muted-foreground",
                      )}
                    >
                      {item.count}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 p-4">
          <div className="rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 p-4 text-center">
            <div className="mb-2 text-2xl">🚀</div>
            <h3 className="text-sm font-medium text-foreground mb-1">Upgrade to Pro</h3>
            <p className="text-xs text-muted-foreground mb-3">Get unlimited storage and advanced features</p>
            <Button size="sm" className="w-full bg-gradient-to-r from-brand to-primary text-white text-xs">
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default KnowledgeSidebar
