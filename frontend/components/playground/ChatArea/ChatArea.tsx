'use client'

import ChatInput from './ChatInput'
import MessageArea from './MessageArea'
const ChatArea = () => {
  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <MessageArea />
      </div>
      <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-4 pt-2 pb-4">
        <div className="mx-auto max-w-3xl w-full">
          <ChatInput />
        </div>
      </div>
    </div>
  )
}

export default ChatArea
