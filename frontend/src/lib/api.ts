import { QueryRequest, QueryResponse, Conversation } from '@/types/chat'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ChatAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async sendMessage(request: QueryRequest): Promise<QueryResponse> {
    return this.request<QueryResponse>('/api/v1/chat/query', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/api/v1/chat/conversations')
  }

  async getConversation(id: string): Promise<Conversation> {
    return this.request<Conversation>(`/api/v1/chat/conversations/${id}`)
  }

  async deleteConversation(id: string): Promise<void> {
    return this.request(`/api/v1/chat/conversations/${id}`, {
      method: 'DELETE',
    })
  }

  async uploadFile(file: File): Promise<{ id: string; status: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/api/v1/documents/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`)
    }

    return response.json()
  }

  async getDocuments(): Promise<any[]> {
    return this.request('/api/v1/documents')
  }
}

export const chatAPI = new ChatAPI()
