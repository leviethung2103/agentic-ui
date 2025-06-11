'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import KnowledgeCard from './KnowledgeCard'
import KnowledgeUpload from './KnowledgeUpload'
import Icon from '@/components/ui/icon'
import { Plus } from 'lucide-react'

interface KnowledgeItem {
  id: string
  title: string
  description: string
  icon: string
}

// Mock data - replace with actual API call
const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: '1',
    title: '数据问答_v1.1.2_deepseek',
    description: '数据问答相关用于数据库问答的智能助手',
    icon: 'agent'
  },
  {
    id: '2',
    title: 'Agentic Investment Research - Agent',
    description: 'Investment research and analysis agent for financial data',
    icon: 'agent'
  },
  {
    id: '3',
    title: 'Agentic RAG - Agent - v2',
    description:
      'You are a helpful assistant that retrieves accurate and complete answers using a knowledge base.',
    icon: 'agent'
  },
  {
    id: '4',
    title: 'Chatbot Weather - Applied React',
    description:
      'Answer the following questions as best you can. You have access to the following tools: Get Weather Data',
    icon: 'agent'
  },
  {
    id: '5',
    title: 'Agentic RAG - v2',
    description:
      'You are a helpful assistant that retrieves accurate and complete answers using a knowledge base.',
    icon: 'agent'
  },
  {
    id: '6',
    title: 'Agentic RAG - Tool RAG',
    description: 'Tool-based RAG implementation for enhanced retrieval',
    icon: 'agent'
  },
  {
    id: '7',
    title: 'Agentic RAG - Agent',
    description: 'Advanced RAG agent for document retrieval and analysis',
    icon: 'agent'
  },
  {
    id: '8',
    title: 'v3 - Haravan Chatbot',
    description: 'Add the rewriting question',
    icon: 'agent'
  },
  {
    id: '9',
    title: 'v2 - Haravan Chatbot',
    description: 'Enhanced chatbot for Haravan platform',
    icon: 'agent'
  },
  {
    id: '10',
    title: 'Query Rewriting',
    description: 'Query rewriting and optimization tool',
    icon: 'agent'
  },
  {
    id: '11',
    title: 'v3 - MultiModal Capabilities to Deepseek',
    description: 'Multi-modal AI capabilities integration',
    icon: 'agent'
  },
  {
    id: '12',
    title: 'File Translation',
    description: 'Document translation service',
    icon: 'agent'
  }
]

const KnowledgeGrid = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [activeTab, setActiveTab] = useState('import')
  const [filteredItems, setFilteredItems] =
    useState<KnowledgeItem[]>(mockKnowledgeItems)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(mockKnowledgeItems)
    } else {
      const filtered = mockKnowledgeItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredItems(filtered)
    }
  }, [searchQuery])

  const handleUpload = async (files: File[]) => {
    try {
      // TODO: Implement actual file upload logic
      console.log('Uploading files:', files.map((file) => file.name).join(', '))

      // Simulate API call for each file
      await Promise.all(
        files.map((file) => new Promise((resolve) => setTimeout(resolve, 1000)))
      )

      // Close the upload form after successful upload
      setShowUpload(false)

      // TODO: Refresh the knowledge items list
    } catch (error) {
      console.error('Upload failed:', error)
      // TODO: Show error message to user
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  if (showUpload) {
    return (
      <div className="p-6">
        <KnowledgeUpload
          onCancel={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col p-6">
      {/* Tab Navigation */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => handleTabChange('import')}
          className={`tab ${activeTab === 'import' ? 'active' : ''}`}
        >
          Import from File
        </button>
        <button
          onClick={() => handleTabChange('sync')}
          className={`tab ${activeTab === 'sync' ? 'active' : ''}`}
        >
          Sync from Website
        </button>
      </div>

      {activeTab === 'sync' && (
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Enter website URL..."
            className="mb-2"
          />
          <Button
            onClick={() => {
              /* Handle sync logic */
            }}
          >
            Sync
          </Button>
        </div>
      )}

      {/* Header with search and add button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-80">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search knowledge..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-brand text-white hover:bg-brand/90"
        >
          <Plus className="h-4 w-4" />
          <span>Add New</span>
        </Button>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-muted">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}{' '}
          found
        </p>
      </div>

      {/* Knowledge items grid */}
      <div className="flex-1 overflow-auto">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredItems.map((item) => (
              <KnowledgeCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Icon
                type="search"
                size="lg"
                className="mx-auto mb-4 text-muted"
              />
              <h3 className="mb-2 text-lg font-medium text-primary">
                No results found
              </h3>
              <p className="text-sm text-muted">
                Try adjusting your search terms or browse all items
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KnowledgeGrid
