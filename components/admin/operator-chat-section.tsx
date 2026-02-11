'use client'

import { useState } from 'react'
import { useAdminStore } from '@/lib/admin-store'
import type { ChatMessage } from '@/lib/admin-mock-data'
import { AlertTriangle, ChevronDown, ChevronUp, Send, X } from 'lucide-react'

function ChatCard({
  msg,
  onViewDetail,
}: {
  msg: ChatMessage
  onViewDetail: (kanbanId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [replying, setReplying] = useState(false)
  const [replyText, setReplyText] = useState('')

  return (
    <div className="relative rounded-lg border border-border bg-card p-3.5">
      {/* Urgent indicator */}
      {msg.isUrgent && (
        <AlertTriangle className="absolute right-3 top-3 h-4 w-4 text-destructive" />
      )}

      {/* Author + time */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-medium text-foreground">
          {msg.authorName.charAt(0)}
        </div>
        <span className="text-sm font-semibold text-foreground">
          {msg.authorName}{' ('}{msg.trackName}{')'}
        </span>
        <span className="text-xs text-muted-foreground">{msg.timeAgo}</span>
      </div>

      {/* Task reference */}
      {msg.taskTitle && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex w-full items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2.5 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-secondary"
        >
          <span className="flex-1 truncate font-medium">
            {'Task: '}{msg.taskTitle}
          </span>
          {expanded ? <ChevronUp className="h-3 w-3 shrink-0" /> : <ChevronDown className="h-3 w-3 shrink-0" />}
        </button>
      )}
      {expanded && msg.taskContent && (
        <div className="mt-1 rounded-md bg-secondary/30 px-2.5 py-2 text-xs leading-relaxed text-muted-foreground">
          {msg.taskContent}
        </div>
      )}

      {/* Message */}
      <p className="mt-2 text-sm leading-relaxed text-foreground">{msg.message}</p>

      {/* Actions */}
      <div className="mt-2.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setReplying(!replying)}
          className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80"
        >
          {'답장'}
        </button>
        {msg.relatedKanbanId && (
          <button
            type="button"
            onClick={() => onViewDetail(msg.relatedKanbanId!)}
            className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80"
          >
            {'상세보기'}
          </button>
        )}
      </div>

      {/* Inline reply */}
      {replying && (
        <div className="mt-2.5 flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="메시지 입력..."
            className="flex-1 rounded-md border border-border bg-secondary/50 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            disabled={!replyText.trim()}
            onClick={() => { setReplyText(''); setReplying(false) }}
            className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-3 w-3" />
            {'전송'}
          </button>
          <button
            type="button"
            onClick={() => { setReplying(false); setReplyText('') }}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  )
}

export function OperatorChatSection({
  onViewKanbanDetail,
}: {
  onViewKanbanDetail?: (kanbanId: string) => void
}) {
  const { chatMessages, plannerTracks } = useAdminStore()
  const [activeTrack, setActiveTrack] = useState<string>('all')
  const [visibleCount, setVisibleCount] = useState(10)

  const trackTabs = [
    { id: 'all', label: '전체 메시지' },
    ...plannerTracks.map((t) => ({ id: t.name, label: t.name.replace('트랙 ', '') })),
  ]

  const filteredMessages =
    activeTrack === 'all'
      ? chatMessages
      : chatMessages.filter((m) => {
          // Match "AI 7기" in trackName against "AI 트랙 7기" tab id
          return m.trackName === activeTrack.replace('트랙 ', '') ||
                 activeTrack.includes(m.trackName)
        })

  const displayed = filteredMessages.slice(0, visibleCount)
  const remaining = filteredMessages.length - visibleCount

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">{'운영매 실시간 채팅'}</h2>

      {/* Tabs */}
      <div className="mb-3 flex gap-1.5">
        {trackTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActiveTrack(tab.id); setVisibleCount(3) }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTrack === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat Cards */}
      <div className="max-h-[520px] space-y-2.5 overflow-y-auto rounded-lg border border-border bg-secondary/20 p-3">
        {displayed.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">{'메시지가 없습니다.'}</p>
        ) : (
          displayed.map((msg) => (
            <ChatCard
              key={msg.id}
              msg={msg}
              onViewDetail={(id) => onViewKanbanDetail?.(id)}
            />
          ))
        )}
      </div>

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisibleCount((v) => v + 5)}
          className="mt-2 w-full rounded-md bg-secondary py-2 text-xs font-medium text-muted-foreground hover:bg-secondary/80"
        >
          {'더보기 '}{remaining}{'개'}
        </button>
      )}
    </section>
  )
}
