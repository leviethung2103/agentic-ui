'use client'

import { useQueryState } from 'nuqs'
import type { SessionEntry } from '../../../../types/playground'
import { Button } from '../../../ui/button'
import useSessionLoader from '../../../../hooks/useSessionLoader'
import { deletePlaygroundSessionAPI } from '../../../../api/playground'
import { usePlaygroundStore } from '../../../../store'
import { toast } from 'sonner'
import Icon from '../../../ui/icon'
import { useState } from 'react'
import DeleteSessionModal from './DeleteSessionModal'
import useChatActions from '../../../../hooks/useChatActions'
import { truncateText, cn } from '../../../../lib/utils'

type SessionItemProps = SessionEntry & {
  isSelected: boolean
  onSessionClick: () => void
  searchQuery?: string
}

const HighlightedText = ({
  text,
  searchQuery
}: {
  text: string
  searchQuery?: string
}) => {
  if (!searchQuery?.trim()) {
    return <span>{text}</span>
  }

  const query = searchQuery.toLowerCase()
  const lowerText = text.toLowerCase()
  const index = lowerText.indexOf(query)

  if (index === -1) {
    return <span>{text}</span>
  }

  const beforeMatch = text.slice(0, index)
  const match = text.slice(index, index + searchQuery.length)
  const afterMatch = text.slice(index + searchQuery.length)

  return (
    <span>
      {beforeMatch}
      <span className="rounded-sm bg-brand/20 px-0.5 font-medium text-brand">
        {match}
      </span>
      {afterMatch}
    </span>
  )
}

const SessionItem = ({
  title,
  session_id,
  isSelected,
  onSessionClick,
  searchQuery
}: SessionItemProps) => {
  const [agentId] = useQueryState('agent')
  const { getSession } = useSessionLoader()
  const [, setSessionId] = useQueryState('session')
  const { selectedEndpoint, sessionsData, setSessionsData } =
    usePlaygroundStore()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { clearChat } = useChatActions()

  const handleGetSession = async () => {
    if (agentId) {
      onSessionClick()
      await getSession(session_id, agentId)
      setSessionId(session_id)
    }
  }

  const handleDeleteSession = async () => {
    if (agentId) {
      try {
        const response = await deletePlaygroundSessionAPI(
          selectedEndpoint,
          agentId,
          session_id
        )
        if (response.status === 200 && sessionsData) {
          setSessionsData(
            sessionsData.filter((session) => session.session_id !== session_id)
          )
          clearChat()
          toast.success('Session deleted')
        } else {
          toast.error('Failed to delete session')
        }
      } catch {
        toast.error('Failed to delete session')
      } finally {
        setIsDeleteModalOpen(false)
      }
    }
  }

  return (
    <>
      <div
        className={cn(
          'group flex h-11 w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition-colors duration-200',
          isSelected
            ? 'cursor-default bg-primary/10'
            : 'bg-background-secondary hover:bg-background-secondary/80'
        )}
        onClick={handleGetSession}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h4
            className={cn(
              'truncate text-sm font-medium',
              isSelected && 'text-primary'
            )}
          >
            <HighlightedText
              text={truncateText(title, 20)}
              searchQuery={searchQuery}
            />
          </h4>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 transform opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            setIsDeleteModalOpen(true)
          }}
        >
          <Icon type="trash" size="xs" />
        </Button>
      </div>
      <DeleteSessionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteSession}
        isDeleting={false}
      />
    </>
  )
}

export default SessionItem
