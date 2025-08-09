'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, ExternalLink, Star } from 'lucide-react'
import { Source } from '@/types/chat'

interface SourcesPanelProps {
  sources: Source[]
  onClose: () => void
}

export function SourcesPanel({ sources, onClose }: SourcesPanelProps) {
  return (
    <div className="w-96 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-semibold">المصادر المستخدمة</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Sources List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {sources.map((source, index) => (
            <div
              key={source.id}
              className="bg-background border border-border rounded-lg p-4 space-y-3"
            >
              {/* Source Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      مصدر {index + 1}
                    </Badge>
                    {source.confidence && (
                      <Badge 
                        variant={source.confidence > 0.8 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {Math.round(source.confidence * 100)}% دقة
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-medium text-sm text-right line-clamp-2">
                    {source.title}
                  </h4>
                </div>
                <Button variant="ghost" size="sm">
                  <Star className="w-3 h-3" />
                </Button>
              </div>

              {/* Source Content */}
              <div className="text-sm text-muted-foreground text-right">
                <div className="bg-muted/50 rounded p-2 mb-2">
                  <p className="line-clamp-4">"{source.snippet}"</p>
                </div>
              </div>

              {/* Source Metadata */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <ExternalLink className="w-3 h-3 ml-1" />
                    عرض المصدر
                  </Button>
                </div>
                <div className="text-left">
                  {source.url && (
                    <div className="truncate max-w-32">
                      {new URL(source.url).hostname}
                    </div>
                  )}
                  {source.timestamp && (
                    <div>
                      {new Date(source.timestamp).toLocaleDateString('ar')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          تم العثور على {sources.length} مصادر موثقة
        </div>
      </div>
    </div>
  )
}
