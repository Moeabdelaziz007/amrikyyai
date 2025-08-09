export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: Source[]
  status?: 'pending' | 'streaming' | 'completed' | 'error'
}

export interface Source {
  id: string
  title: string
  snippet: string
  url?: string
  timestamp?: Date
  confidence?: number
  metadata?: {
    docId?: string
    chunkId?: string
    pageNumber?: number
    section?: string
  }
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  messages: Message[]
  isLoading: boolean
  error: string | null
}

export interface QueryRequest {
  message: string
  conversationId?: string
  options?: {
    temperature?: number
    maxTokens?: number
    sources?: boolean
    model?: string
  }
}

export interface QueryResponse {
  id: string
  content: string
  sources?: Source[]
  conversationId: string
  timestamp: Date
}
