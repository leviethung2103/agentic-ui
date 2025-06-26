'use client'
import KnowledgeSidebar from '../../components/knowledge/KnowledgeSidebar'
import KnowledgeArea from '../../components/knowledge/KnowledgeArea'
import { Suspense } from 'react'

export default function KnowledgePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-screen bg-background/80">
        <KnowledgeSidebar />
        <KnowledgeArea />
      </div>
    </Suspense>
  )
}
