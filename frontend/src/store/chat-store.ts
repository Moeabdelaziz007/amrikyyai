import { create } from 'zustand'
import { ChatState, Conversation, Message, QueryRequest } from '@/types/chat'
import { chatAPI } from '@/lib/api'

interface ChatActions {
  sendMessage: (content: string) => Promise<void>
  createNewConversation: () => void
  setActiveConversation: (id: string) => void
  loadConversations: () => Promise<void>
  clearError: () => void
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  // State
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoading: false,
  error: null,

  // Actions
  sendMessage: async (content: string) => {
    const { activeConversationId } = get()
    
    // Add user message optimistically
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      status: 'completed'
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null
    }))

    try {
      const request: QueryRequest = {
        message: content,
        conversationId: activeConversationId || undefined,
        options: {
          sources: true,
          temperature: 0.1
        }
      }

      const response = await chatAPI.sendMessage(request)

      const assistantMessage: Message = {
        id: response.id,
        role: 'assistant',
        content: response.content,
        timestamp: response.timestamp,
        sources: response.sources,
        status: 'completed'
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
        activeConversationId: response.conversationId
      }))

      // Update conversation title if it's the first message
      if (!activeConversationId) {
        const conversations = get().conversations
        const newConversation = conversations.find(c => c.id === response.conversationId)
        if (newConversation && newConversation.title === 'محادثة جديدة') {
          const title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
          set((state) => ({
            conversations: state.conversations.map(c => 
              c.id === response.conversationId 
                ? { ...c, title, updatedAt: new Date() }
                : c
            )
          }))
        }
      }

    } catch (error) {
      set((state) => ({
        isLoading: false,
        error: error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال الرسالة'
      }))
    }
  },

  createNewConversation: () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'محادثة جديدة',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      activeConversationId: newConversation.id,
      messages: [],
      error: null
    }))
  },

  setActiveConversation: (id: string) => {
    const { conversations } = get()
    const conversation = conversations.find(c => c.id === id)
    
    if (conversation) {
      set({
        activeConversationId: id,
        messages: conversation.messages,
        error: null
      })
    }
  },

  loadConversations: async () => {
    try {
      const conversations = await chatAPI.getConversations()
      set({ conversations })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'فشل في تحميل المحادثات'
      })
    }
  },

  clearError: () => {
    set({ error: null })
  }
}))
