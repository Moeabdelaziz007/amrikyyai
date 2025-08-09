'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Send, 
  Paperclip, 
  Mic, 
  Settings,
  Loader2
} from 'lucide-react'
import { useChatStore } from '@/store/chat-store'

interface MessageInputProps {
  isLoading: boolean
}

export function MessageInput({ isLoading }: MessageInputProps) {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage } = useChatStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    await sendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 bg-card border border-border rounded-lg p-3">
          {/* File Upload */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Text Input */}
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "المساعد يكتب..." : "اكتب رسالتك هنا..."}
            disabled={isLoading}
            className="flex-1 min-h-0 max-h-48 resize-none border-0 bg-transparent focus:ring-0 text-right"
            rows={1}
          />

          {/* Voice Recording */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`flex-shrink-0 ${isRecording ? 'text-red-500' : ''}`}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className="w-4 h-4" />
          </Button>

          {/* Settings */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="sm"
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="text-xs text-muted-foreground">
            Enter لإرسال • Shift+Enter لسطر جديد
          </div>
          <div className="text-xs text-muted-foreground">
            {input.length}/2000
          </div>
        </div>
      </form>
    </div>
  )
}
