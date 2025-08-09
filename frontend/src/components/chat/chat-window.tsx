'use client'

import { useEffect, useRef } from 'react'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { useChatStore } from '@/store/chat-store'

interface ChatWindowProps {
  onShowSources: () => void
}

export function ChatWindow({ onShowSources }: ChatWindowProps) {
  const { messages, isLoading } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto p-6">
              <h2 className="text-2xl font-bold mb-4">مرحباً بك في Amrikyy AI</h2>
              <p className="text-muted-foreground mb-6">
                مساعدك الذكي المدعوم بتقنية RAG. اسأل أي سؤال وسأجيبك بناءً على المصادر الموثوقة.
              </p>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="bg-card border border-border rounded-lg p-3 text-right">
                  💡 اسأل عن الوثائق والملفات المرفوعة
                </div>
                <div className="bg-card border border-border rounded-lg p-3 text-right">
                  📚 احصل على إجابات مع مصادر موثقة
                </div>
                <div className="bg-card border border-border rounded-lg p-3 text-right">
                  🔍 البحث في قاعدة المعرفة الخاصة بك
                </div>
              </div>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} onShowSources={onShowSources} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background">
        <MessageInput isLoading={isLoading} />
      </div>
    </div>
  )
}
