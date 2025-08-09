'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Send, 
  Paperclip, 
  Mic, 
  Settings,
  Loader2,
  Sparkles,
  Code,
  Brain,
  Zap
} from 'lucide-react'
import { useChatStore } from '@/store/chat-store'

interface MessageInputProps {
  isLoading: boolean
}

export function MessageInput({ isLoading }: MessageInputProps) {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [aiMode, setAiMode] = useState<'chat' | 'code' | 'analyze'>('chat')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage } = useChatStore()

  // Smart suggestions based on input
  const smartSuggestions = {
    programming: [
      'كيف أطبق مبادئ SOLID في Python؟',
      'أرني مثال على نمط Circuit Breaker',
      'ما هي أفضل ممارسات الأمان في API؟',
      'كيف أحسن أداء قاعدة البيانات؟'
    ],
    ai: [
      'كيف أبني chatbot باستخدام RAG؟',
      'ما الفرق بين GPT-4 و GPT-3.5؟',
      'كيف أدرب نموذج machine learning؟',
      'أرني كيف أستخدم vector databases'
    ],
    architecture: [
      'كيف أصمم microservices architecture؟',
      'ما هو Clean Architecture؟',
      'أفضل patterns للتعامل مع الـ state؟',
      'كيف أطبق Domain Driven Design؟'
    ]
  }

  useEffect(() => {
    if (input.length > 3) {
      const inputLower = input.toLowerCase()
      let relevantSuggestions: string[] = []
      
      if (inputLower.includes('python') || inputLower.includes('code') || inputLower.includes('برمجة')) {
        relevantSuggestions = smartSuggestions.programming
      } else if (inputLower.includes('ai') || inputLower.includes('ذكاء') || inputLower.includes('machine')) {
        relevantSuggestions = smartSuggestions.ai
      } else if (inputLower.includes('architecture') || inputLower.includes('design') || inputLower.includes('تصميم')) {
        relevantSuggestions = smartSuggestions.architecture
      }
      
      setSuggestions(relevantSuggestions.slice(0, 3))
      setShowSuggestions(relevantSuggestions.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [input])

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

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setShowSuggestions(false)
    textareaRef.current?.focus()
  }

  const getModeIcon = () => {
    switch (aiMode) {
      case 'code': return <Code className="w-4 h-4" />
      case 'analyze': return <Brain className="w-4 h-4" />
      default: return <Sparkles className="w-4 h-4" />
    }
  }

  const getModeColor = () => {
    switch (aiMode) {
      case 'code': return 'text-blue-500'
      case 'analyze': return 'text-purple-500'
      default: return 'text-green-500'
    }
  }

  return (
    <div className="p-4">
      {/* Smart Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mb-3 space-y-2">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3" />
            اقتراحات ذكية
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-accent hover:bg-accent/80 text-accent-foreground px-3 py-1 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        {/* AI Mode Selector */}
        <div className="flex items-center gap-1 mb-2">
          <div className="text-xs text-muted-foreground">وضع الذكاء الاصطناعي:</div>
          <div className="flex bg-accent rounded-lg p-1">
            <button
              type="button"
              onClick={() => setAiMode('chat')}
              className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                aiMode === 'chat' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              محادثة
            </button>
            <button
              type="button"
              onClick={() => setAiMode('code')}
              className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                aiMode === 'code' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              }`}
            >
              <Code className="w-3 h-3" />
              برمجة
            </button>
            <button
              type="button"
              onClick={() => setAiMode('analyze')}
              className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                aiMode === 'analyze' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              }`}
            >
              <Brain className="w-3 h-3" />
              تحليل
            </button>
          </div>
        </div>

        <div className="flex items-end gap-2 bg-card border border-border rounded-lg p-3">
          {/* AI Mode Indicator */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`flex-shrink-0 ${getModeColor()}`}
          >
            {getModeIcon()}
          </Button>

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
            placeholder={
              isLoading 
                ? "المساعد يكتب..." 
                : aiMode === 'code' 
                  ? "اكتب سؤالك البرمجي..."
                  : aiMode === 'analyze'
                    ? "اكتب ما تريد تحليله..."
                    : "اكتب رسالتك هنا..."
            }
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
            Enter لإرسال • Shift+Enter لسطر جديد • {aiMode === 'code' ? 'وضع البرمجة' : aiMode === 'analyze' ? 'وضع التحليل' : 'وضع المحادثة'}
          </div>
          <div className="text-xs text-muted-foreground">
            {input.length}/2000
          </div>
        </div>
      </form>
    </div>
  )
}
