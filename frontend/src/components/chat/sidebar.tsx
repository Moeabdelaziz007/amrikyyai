'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  Upload,
  History,
  Search
} from 'lucide-react'
import { useChatStore } from '@/store/chat-store'

export function Sidebar() {
  const { conversations, createNewConversation, setActiveConversation } = useChatStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Button 
          onClick={createNewConversation}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          محادثة جديدة
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="البحث في المحادثات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2">
        {filteredConversations.map((conversation) => (
          <Button
            key={conversation.id}
            variant="ghost"
            className="w-full justify-start gap-2 mb-1 h-auto p-3"
            onClick={() => setActiveConversation(conversation.id)}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <div className="text-right truncate">
              <div className="text-sm font-medium truncate">{conversation.title}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(conversation.updatedAt).toLocaleDateString('ar')}
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Upload className="w-4 h-4" />
          رفع ملفات
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <History className="w-4 h-4" />
          السجل
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="w-4 h-4" />
          الإعدادات
        </Button>
      </div>
    </div>
  )
}
