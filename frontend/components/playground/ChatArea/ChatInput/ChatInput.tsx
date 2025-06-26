'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { TextArea } from '../../../ui/textarea'
import { Button } from '../../../ui/button'
import { usePlaygroundStore } from '../../../../store'
import useAIChatStreamHandler from '../../../../hooks/useAIStreamHandler'
import { useQueryState } from 'nuqs'
import Icon from '../../../ui/icon'

const ChatInput = () => {
  const { chatInputRef } = usePlaygroundStore()

  const { handleStreamResponse } = useAIChatStreamHandler()
  const [selectedAgent] = useQueryState('agent')
  const [inputMessage, setInputMessage] = useState('')
  const isStreaming = usePlaygroundStore((state) => state.isStreaming)
  const handleSubmit = async () => {
    if (!inputMessage.trim()) return

    const currentMessage = inputMessage
    setInputMessage('')

    try {
      await handleStreamResponse(currentMessage)
    } catch (error) {
      toast.error(
        `Error in handleSubmit: ${error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  return (
    <div className="relative w-full">
      <div
        className={`relative flex items-end w-full ${isStreaming ? 'animate-gradient-border rounded-full' : ''
          }`}
      >
        <TextArea
          placeholder={'Ask anything...'}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.nativeEvent.isComposing &&
              !e.shiftKey &&
              !isStreaming
            ) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          className="w-full min-h-[52px] max-h-40 pr-14 py-3 resize-none rounded-full border pl-6 text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:outline-none relative bg-background"
          disabled={!selectedAgent || isStreaming}
          ref={chatInputRef}
          rows={1}
        />
        <Button
          onClick={handleSubmit}
          disabled={!selectedAgent || !inputMessage.trim() || isStreaming}
          size="icon"
          className={`absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full transition-all ${isStreaming
            ? 'bg-primary disabled:opacity-100'
            : 'bg-primary hover:bg-primary/90'
            } ${!isStreaming && (!selectedAgent || !inputMessage.trim())
              ? 'opacity-50'
              : ''
            }`}
        >
          {isStreaming ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <Icon type="send" size="md" className="text-primary-foreground" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default ChatInput
