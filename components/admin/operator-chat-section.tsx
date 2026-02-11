'use client'

import { useState, useRef, useEffect } from 'react'
import { useAdminStore } from '@/lib/admin-store'
import type { ChatMessage } from '@/lib/admin-mock-data'
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Send,
  LinkIcon,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Single chat bubble (KakaoTalk style)                              */
/* ------------------------------------------------------------------ */

function ChatBubble({
  msg,
  onViewDetail,
}: {
  msg: ChatMessage
  onViewDetail: (kanbanId: string) => void
}) {
  const [taskExpanded, setTaskExpanded] = useState(false)

  return (
    <div className="flex items-start gap-2.5">
      {/* Avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-secondary text-sm font-bold text-foreground shadow-sm">
        {msg.authorName.charAt(0)}
      </div>

      {/* Name + bubble */}
      <div className="min-w-0 max-w-[85%]">
        {/* Name & track badge */}
        <div className="mb-1 flex items-center gap-1.5">
          <span className="text-[13px] font-bold text-foreground">{msg.authorName}</span>
          <span className="rounded-full px-1.5 py-px text-[11px] font-medium text-muted-foreground" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
            {msg.trackName}
          </span>
          {msg.isUrgent && (
            <span className="flex items-center gap-0.5 rounded-full bg-destructive/10 px-1.5 py-px text-[11px] font-semibold text-destructive">
              <AlertTriangle className="h-3 w-3" />
              {'긴급'}
            </span>
          )}
        </div>

        <div className="flex items-end gap-1.5">
          {/* Bubble */}
          <div className="relative rounded-[14px] rounded-tl-sm px-3.5 py-2 shadow-sm" style={{ backgroundColor: 'hsl(var(--chat-bubble-other))' }}>
            {/* Message text */}
            <p className="text-[13px] leading-relaxed text-foreground">{msg.message}</p>

            {/* Task reference card inside bubble */}
            {msg.taskTitle && (
              <button
                type="button"
                onClick={() => setTaskExpanded(!taskExpanded)}
                className="mt-2 flex w-full items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/40 px-2.5 py-1.5 text-left transition-colors hover:bg-secondary/60"
              >
                <LinkIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-xs font-medium text-foreground">
                  {msg.taskTitle}
                </span>
                {taskExpanded
                  ? <ChevronUp className="h-3 w-3 shrink-0 text-muted-foreground" />
                  : <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />}
              </button>
            )}
            {taskExpanded && msg.taskContent && (
              <div className="mt-1.5 rounded-lg bg-secondary/30 px-2.5 py-2 text-xs leading-relaxed text-muted-foreground">
                {msg.taskContent}
              </div>
            )}

            {/* Kanban link */}
            {msg.relatedKanbanId && (
              <button
                type="button"
                onClick={() => onViewDetail(msg.relatedKanbanId!)}
                className="mt-1.5 text-xs font-medium text-primary hover:underline"
              >
                {'칸반 카드 보기 >'}
              </button>
            )}
          </div>

          {/* Timestamp beside bubble */}
          <span className="shrink-0 pb-0.5 text-[11px] text-muted-foreground">{msg.timeAgo}</span>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Self-sent bubble (right-aligned, yellow)                          */
/* ------------------------------------------------------------------ */

function SelfBubble({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex justify-end">
      <div className="flex items-end gap-1.5">
        <span className="shrink-0 pb-0.5 text-[11px] text-muted-foreground">{time}</span>
        <div className="max-w-[75%] rounded-[14px] rounded-tr-sm px-3.5 py-2 shadow-sm" style={{ backgroundColor: 'hsl(var(--chat-bubble-self))' }}>
          <p className="text-[13px] leading-relaxed text-foreground">{text}</p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main section                                                      */
/* ------------------------------------------------------------------ */

export function OperatorChatSection({
  onViewKanbanDetail,
}: {
  onViewKanbanDetail?: (kanbanId: string) => void
}) {
  const { chatMessages, plannerTracks } = useAdminStore()
  const [activeTrack, setActiveTrack] = useState<string>('all')
  const [inputText, setInputText] = useState('')
  const [sentMessages, setSentMessages] = useState<{ text: string; time: string }[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const trackTabs = [
    { id: 'all', label: '전체' },
    ...plannerTracks.map((t) => ({ id: t.name, label: t.name.replace('트랙 ', '') })),
  ]

  const filteredMessages =
    activeTrack === 'all'
      ? chatMessages
      : chatMessages.filter((m) => {
          return m.trackName === activeTrack.replace('트랙 ', '') ||
                 activeTrack.includes(m.trackName)
        })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [sentMessages.length])

  const handleSend = () => {
    if (!inputText.trim()) return
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    setSentMessages((prev) => [...prev, { text: inputText.trim(), time }])
    setInputText('')
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">{'운영매 실시간 채팅'}</h2>

      {/* Track filter tabs */}
      <div className="mb-2 flex gap-1">
        {trackTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTrack(tab.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTrack === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-border shadow-sm">
        {/* Chat header bar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
          <span className="text-sm font-semibold text-foreground">
            {activeTrack === 'all' ? '전체 메시지' : activeTrack.replace('트랙 ', '')}
          </span>
          <span className="text-xs text-muted-foreground">
            {filteredMessages.length}{'개의 메시지'}
          </span>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex max-h-[460px] min-h-[320px] flex-col gap-3 overflow-y-auto px-4 py-3"
          style={{ backgroundColor: 'hsl(var(--chat-bg))' }}
        >
          {filteredMessages.length === 0 && sentMessages.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">{'메시지가 없습니다.'}</p>
          ) : (
            <>
              {filteredMessages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  msg={msg}
                  onViewDetail={(id) => onViewKanbanDetail?.(id)}
                />
              ))}
              {sentMessages.map((m, i) => (
                <SelfBubble key={`self-${i}`} text={m.text} time={m.time} />
              ))}
            </>
          )}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="메시지를 입력하세요..."
            className="flex-1 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            disabled={!inputText.trim()}
            onClick={handleSend}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors disabled:opacity-40"
            aria-label="메시지 전송"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
