"use client"
import KnowledgeGrid from "./KnowledgeGrid"
import OtherSection from "./OtherSection"
import { useSearchParams } from "next/navigation"

const KnowledgeArea = () => {
  const searchParams = useSearchParams()
  const section = searchParams.get("section") || "knowledge"

  return (
    <main className="relative m-1.5 flex flex-grow flex-col rounded-xl bg-background">
      <div className="flex h-full flex-col">{section === "knowledge" ? <KnowledgeGrid /> : <OtherSection />}</div>
    </main>
  )
}

export default KnowledgeArea
