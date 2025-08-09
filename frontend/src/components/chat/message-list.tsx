'use client'

import { Message } from '@/types/chat'
import { MessageBubble } from './message-bubble'

interface MessageListProps {
  messages: Message[]
  onShowSources: () => void
}

export function MessageList({ messages, onShowSources }: MessageListProps) {
  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          onShowSources={onShowSources}
        />
      ))}
    </div>
  )
}
