'use client'

import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { usePlaygroundStore } from '@/store'
import { useQueryState } from 'nuqs'
import SessionItem from './SessionItem'
import SessionBlankState from './SessionBlankState'
import useSessionLoader from '@/hooks/useSessionLoader'
import SearchInput from '../SearchInput'

import { cn } from '@/lib/utils'
import type { FC } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface SkeletonListProps {
  skeletonCount: number
}

const SkeletonList: FC<SkeletonListProps> = ({ skeletonCount }) => {
  const skeletons = useMemo(
    () => Array.from({ length: skeletonCount }, (_, i) => i),
    [skeletonCount]
  )

  return skeletons.map((skeleton, index) => (
    <Skeleton
      key={skeleton}
      className={cn(
        'mb-1 h-11 rounded-lg px-3 py-2',
        index > 0 && 'bg-background-secondary'
      )}
    />
  ))
}

dayjs.extend(utc)

const formatDate = (
  timestamp: number,
  format: 'natural' | 'full' = 'full'
): string => {
  const date = dayjs.unix(timestamp).utc()
  return format === 'natural'
    ? date.format('HH:mm')
    : date.format('YYYY-MM-DD HH:mm:ss')
}

const Sessions = () => {
  const [agentId] = useQueryState('agent', {
    parse: (value) => value || undefined,
    history: 'push'
  })
  const [sessionId] = useQueryState('session')
  const {
    selectedEndpoint,
    isEndpointActive,
    isEndpointLoading,
    sessionsData,
    hydrated,
    hasStorage,
    setSessionsData
  } = usePlaygroundStore()
  const [isScrolling, setIsScrolling] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const { getSession, getSessions } = useSessionLoader()
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const { isSessionsLoading } = usePlaygroundStore()

  const handleScroll = () => {
    setIsScrolling(true)

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 1500)
  }

  // Cleanup the scroll timeout when component unmounts
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Load a session on render if a session id exists in url
  useEffect(() => {
    if (sessionId && agentId && selectedEndpoint && hydrated) {
      getSession(sessionId, agentId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

  useEffect(() => {
    if (!selectedEndpoint || !agentId || !hasStorage) {
      setSessionsData(() => null)
      return
    }
    if (!isEndpointLoading) {
      setSessionsData(() => null)
      getSessions(agentId)
    }
  }, [
    selectedEndpoint,
    agentId,
    getSessions,
    isEndpointLoading,
    hasStorage,
    setSessionsData
  ])

  useEffect(() => {
    if (sessionId) {
      setSelectedSessionId(sessionId)
    }
  }, [sessionId])

  const formattedSessionsData = useMemo(() => {
    if (!sessionsData || !Array.isArray(sessionsData)) return []

    return sessionsData.map((entry) => ({
      ...entry,
      created_at: entry.created_at,
      formatted_time: formatDate(entry.created_at, 'natural')
    }))
  }, [sessionsData])

  // Filter sessions based on search query
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return formattedSessionsData

    const query = searchQuery.toLowerCase().trim()
    return formattedSessionsData.filter(
      (session) =>
        session.title.toLowerCase().includes(query) ||
        session.session_id.toLowerCase().includes(query)
    )
  }, [formattedSessionsData, searchQuery])

  const handleSessionClick = useCallback(
    (id: string) => () => setSelectedSessionId(id),
    []
  )

  const showSearchResults = searchQuery.trim() && filteredSessions.length === 0
  const showNoSessions =
    !isSessionsLoading && (!sessionsData || sessionsData.length === 0)

  if (isSessionsLoading || isEndpointLoading)
    return (
      <div className="w-full">
        <div className="mb-2 text-xs font-medium uppercase">Sessions</div>
        <div className="mt-4 h-[calc(100vh-325px)] w-full overflow-y-auto">
          <SkeletonList skeletonCount={5} />
        </div>
      </div>
    )

  return (
    <div className="w-full">
      <div className="mb-3 w-full text-xs font-medium uppercase">Sessions</div>

      {/* Search Input */}
      {isEndpointActive && hasStorage && (
        <div className="mb-3">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search sessions..."
          />
        </div>
      )}

      <div
        className={`h-[calc(100vh-385px)] overflow-y-auto font-geist transition-all duration-300 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:transition-opacity [&::-webkit-scrollbar]:duration-300 ${isScrolling ? '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-background [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:opacity-0' : '[&::-webkit-scrollbar]:opacity-100'}`}
        onScroll={handleScroll}
        onMouseOver={() => setIsScrolling(true)}
        onMouseLeave={handleScroll}
      >
        {!isEndpointActive || !hasStorage || showNoSessions ? (
          <SessionBlankState />
        ) : showSearchResults ? (
          <div className="mt-1 flex items-center justify-center rounded-lg bg-background-secondary/50 pb-6 pt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-sm font-medium text-primary">
                  No results found
                </h3>
                <p className="max-w-[210px] text-center text-sm text-muted">
                  No sessions match your search query "{searchQuery}"
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-y-1 pr-1">
            {filteredSessions.map((entry, index) => (
              <SessionItem
                key={`${entry.session_id}-${index}`}
                {...entry}
                isSelected={selectedSessionId === entry.session_id}
                onSessionClick={handleSessionClick(entry.session_id)}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sessions
