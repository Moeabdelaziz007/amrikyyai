'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { ChatWindow } from './chat-window'
import { SourcesPanel } from './sources-panel'
import { useChatStore } from '@/store/chat-store'

export function ChatShell() {
  const [showSources, setShowSources] = useState(false)
  const { messages } = useChatStore()

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex">
        <ChatWindow onShowSources={() => setShowSources(true)} />
        
        {/* Sources Panel */}
        {showSources && (
          <SourcesPanel 
            onClose={() => setShowSources(false)}
            sources={messages.find(m => m.sources)?.sources || []}
          />
        )}
      </div>
    </div>
  )
}
