"use client"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Search, Plus, Filter, Grid3X3, List, SortAsc } from "lucide-react"
import KnowledgeCard from "./KnowledgeCard"
import KnowledgeUpload from "./KnowledgeUpload"
import { Badge } from "../ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

interface KnowledgeItem {
  id: string
  title: string
  description: string
  icon: string
}

// Mock data - replace with actual API call
const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: "1",
    title: "数据问答_v1.1.2_deepseek.pdf",
    description: "数据问答相关用于数据库问答的智能助手，包含完整的问答逻辑和数据处理流程",
    icon: "agent",
  },
  {
    id: "2",
    title: "Agentic Investment Research - Agent.docx",
    description:
      "Investment research and analysis agent for financial data with comprehensive market analysis capabilities",
    icon: "agent",
  },
  {
    id: "3",
    title: "Agentic RAG - Agent - v2.md",
    description:
      "You are a helpful assistant that retrieves accurate and complete answers using a knowledge base with advanced retrieval techniques",
    icon: "agent",
  },
  {
    id: "4",
    title: "Chatbot Weather - Applied React.txt",
    description:
      "Answer the following questions as best you can. You have access to the following tools: Get Weather Data, Location Services, and Real-time Updates",
    icon: "agent",
  },
  {
    id: "5",
    title: "Agentic RAG - v2.pdf",
    description:
      "You are a helpful assistant that retrieves accurate and complete answers using a knowledge base with enhanced semantic search",
    icon: "agent",
  },
  {
    id: "6",
    title: "Agentic RAG - Tool RAG.xlsx",
    description:
      "Tool-based RAG implementation for enhanced retrieval with structured data processing and analysis workflows",
    icon: "agent",
  },
]

const KnowledgeGrid = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showUpload, setShowUpload] = useState(false)
  const [activeTab, setActiveTab] = useState("import")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>(mockKnowledgeItems)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      if (!searchQuery.trim()) {
        setFilteredItems(mockKnowledgeItems)
      } else {
        const filtered = mockKnowledgeItems.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setFilteredItems(filtered)
      }
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleUpload = async (files: File[]) => {
    try {
      console.log("Uploading files:", files.map((file) => file.name).join(", "))
      await Promise.all(files.map((file) => new Promise((resolve) => setTimeout(resolve, 1000))))
      setShowUpload(false)
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  if (showUpload) {
    return (
      <div className="animate-fade-in p-6">
        <KnowledgeUpload onCancel={() => setShowUpload(false)} onUpload={handleUpload} />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-gradient-to-r from-background via-background/95 to-background p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground">Manage and organize your knowledge documents</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex space-x-1 rounded-xl bg-muted/30 p-1 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("import")}
            className={`flex-1 rounded-lg transition-all duration-200 ${activeTab === "import"
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
          >
            Import from File
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("sync")}
            className={`flex-1 rounded-lg transition-all duration-200 ${activeTab === "sync"
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
          >
            Sync from Website
          </Button>
        </div>

        {activeTab === "sync" && (
          <div className="animate-slide-in-up mb-6 rounded-xl border border-border/50 bg-gradient-to-br from-muted/20 to-muted/10 p-4 backdrop-blur-sm">
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="Enter website URL to sync..."
                className="flex-1 bg-background/80 backdrop-blur-sm border-border/50"
              />
              <Button className="btn-hover-lift bg-brand text-white hover:bg-brand/90 shadow-lg">Sync Website</Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Enter a website URL to automatically extract and sync its content to your knowledge base.
            </p>
          </div>
        )}

        {/* Search and Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search knowledge base..."
              className="pl-9 bg-background/80 backdrop-blur-sm border-border/50 focus:ring-2 focus:ring-brand/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="btn-hover-lift">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All Files</DropdownMenuItem>
                <DropdownMenuItem>PDF Documents</DropdownMenuItem>
                <DropdownMenuItem>Word Documents</DropdownMenuItem>
                <DropdownMenuItem>Text Files</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="btn-hover-lift">
                  <SortAsc className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Name A-Z</DropdownMenuItem>
                <DropdownMenuItem>Name Z-A</DropdownMenuItem>
                <DropdownMenuItem>Date Modified</DropdownMenuItem>
                <DropdownMenuItem>File Size</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex rounded-lg border border-border/50 bg-muted/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-r-none ${viewMode === "grid" ? "bg-background shadow-sm" : ""}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-l-none ${viewMode === "list" ? "bg-background shadow-sm" : ""}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={() => setShowUpload(true)}
              className="btn-hover-lift bg-gradient-to-r from-brand to-primary text-white shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Knowledge
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-muted/50 text-foreground">
              {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
            </Badge>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear search
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-border/50 bg-muted/20 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-muted/50" />
                  <div className="h-4 w-16 rounded bg-muted/50" />
                </div>
                <div className="mb-3 h-5 w-3/4 rounded bg-muted/50" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted/50" />
                  <div className="h-3 w-2/3 rounded bg-muted/50" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Knowledge Items Grid */}
        {!isLoading && filteredItems.length > 0 && (
          <div
            className={`grid gap-6 ${viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                : "grid-cols-1"
              }`}
          >
            {filteredItems.map((item, index) => (
              <div key={item.id} className="grid-item" style={{ animationDelay: `${index * 50}ms` }}>
                <KnowledgeCard item={item} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="animate-fade-in flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-muted/30 to-muted/10 ring-1 ring-border/50">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {searchQuery ? "No results found" : "No knowledge items yet"}
              </h3>
              <p className="mb-6 text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? "Try adjusting your search terms or browse all items"
                  : "Get started by adding your first knowledge item to build your knowledge base"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setShowUpload(true)}
                  className="btn-hover-lift bg-gradient-to-r from-brand to-primary text-white shadow-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Knowledge
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KnowledgeGrid
