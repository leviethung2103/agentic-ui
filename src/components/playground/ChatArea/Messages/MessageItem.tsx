import Icon from '@/components/ui/icon'
import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer'
import { usePlaygroundStore } from '@/store'
import type { PlaygroundChatMessage } from '@/types/playground'
import Videos from './Multimedia/Videos'
import Images from './Multimedia/Images'
import Audios from './Multimedia/Audios'
import { memo, useState } from 'react'
import AgentThinkingLoader from './AgentThinkingLoader'
import { Button } from '@/components/ui/button'
import { Check, Copy, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react'

interface MessageProps {
  message: PlaygroundChatMessage
}

const AgentMessage = ({ message }: MessageProps) => {
  const { streamingErrorMessage } = usePlaygroundStore()
  const [isCopied, setIsCopied] = useState(false)
  const [userFeedback, setUserFeedback] = useState<'like' | 'dislike' | null>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content || message.response_audio?.transcript || '')
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleFeedback = (type: 'like' | 'dislike') => {
    setUserFeedback(type)
    // Here you can add logic to send feedback to your backend
    console.log(`User ${type}d the message:`, message.id)
  }

  const handleShare = async () => {
    const text = message.content || message.response_audio?.transcript || ''
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this message',
          text: text,
          url: window.location.href
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy text: ', err)
      }
    }
  }

  let messageContent
  if (message.streamingError) {
    messageContent = (
      <p className="text-destructive">
        Oops! Something went wrong while streaming.{' '}
        {streamingErrorMessage ? (
          <>{streamingErrorMessage}</>
        ) : (
          'Please try refreshing the page or try again later.'
        )}
      </p>
    )
  } else if (message.content) {
    messageContent = (
      <div className="flex w-full flex-col gap-4">
        <MarkdownRenderer>{message.content}</MarkdownRenderer>
        {message.videos && message.videos.length > 0 && (
          <Videos videos={message.videos} />
        )}
        {message.images && message.images.length > 0 && (
          <Images images={message.images} />
        )}
        {message.audio && message.audio.length > 0 && (
          <Audios audio={message.audio} />
        )}
      </div>
    )
  } else if (message.response_audio) {
    if (!message.response_audio.transcript) {
      messageContent = (
        <div className="mt-2 flex items-start">
          <AgentThinkingLoader />
        </div>
      )
    } else {
      messageContent = (
        <div className="flex w-full flex-col gap-4">
          <MarkdownRenderer>
            {message.response_audio.transcript}
          </MarkdownRenderer>
          {message.response_audio.content && message.response_audio && (
            <Audios audio={[message.response_audio]} />
          )}
        </div>
      )
    }
  } else {
    messageContent = (
      <div className="mt-2">
        <AgentThinkingLoader />
      </div>
    )
  }

  return (
    <div className="group relative flex flex-row items-start gap-4 font-geist">
      <div className="flex-shrink-0">
        <Icon type="agent" size="sm" />
      </div>
      <div className="flex-1">
        {messageContent}
        {!message.streamingError && message.content && (
          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant={userFeedback === 'like' ? 'default' : 'ghost'}
              size="icon"
              className={`h-8 w-8 rounded-full ${userFeedback === 'like' ? 'text-green-500' : ''}`}
              onClick={() => handleFeedback('like')}
              title="Like this response"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant={userFeedback === 'dislike' ? 'default' : 'ghost'}
              size="icon"
              className={`h-8 w-8 rounded-full ${userFeedback === 'dislike' ? 'text-red-500' : ''}`}
              onClick={() => handleFeedback('dislike')}
              title="Dislike this response"
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleShare}
              title="Share this message"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const UserMessage = memo(({ message }: MessageProps) => {
  return (
    <div className="flex items-start pt-4 text-start max-md:break-words">
      <div className="flex flex-row gap-x-3">
        <p className="flex items-center gap-x-2 text-sm font-medium text-muted">
          <Icon type="user" size="sm" />
        </p>
        <div className="text-md rounded-lg py-1 font-geist text-secondary">
          {message.content}
        </div>
      </div>
    </div>
  )
})

AgentMessage.displayName = 'AgentMessage'
UserMessage.displayName = 'UserMessage'
export { AgentMessage, UserMessage }
