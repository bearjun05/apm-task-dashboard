'use client'

import { useState, useRef, useEffect } from 'react'
import { useAdminStore } from '@/lib/admin-store'
import type { ChatBubbleData, ChatRoom } from '@/lib/admin-mock-data'
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Send,
  LinkIcon,
  MessageSquare,
  Tag,
  X,
} from 'lucide-react'
import type { KanbanCard } from '@/lib/admin-mock-data'

/* ------------------------------------------------------------------ */
/*  Chat room list item (left panel)                                  */
/* ------------------------------------------------------------------ */

function RoomListItem({
  room,
  isActive,
  onClick,
}: {
  room: ChatRoom
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
        isActive
          ? 'bg-primary/10'
          : 'hover:bg-secondary/60'
      }`}
    >
      {/* Avatar */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-secondary text-sm font-bold text-foreground shadow-sm">
        {room.operatorName.charAt(0)}
        {room.hasUrgent && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-destructive" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">{room.operatorName}</span>
          <span className="text-[11px] text-muted-foreground">{room.lastTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="truncate text-xs text-muted-foreground">{room.lastMessage}</p>
          {room.unreadCount > 0 && (
            <span className="ml-2 flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {room.unreadCount}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex gap-1">
          {room.tracks.map((t) => (
            <span key={t} className="rounded bg-secondary px-1.5 py-px text-[10px] font-medium text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Single chat bubble                                                */
/* ------------------------------------------------------------------ */

function Bubble({
  data,
  onViewDetail,
}: {
  data: ChatBubbleData
  onViewDetail: (kanbanId: string) => void
}) {
  const [taskExpanded, setTaskExpanded] = useState(false)

  if (data.isSelf) {
    return (
      <div className="flex justify-end">
        <div className="flex items-end gap-1.5">
          <span className="shrink-0 pb-0.5 text-[11px] text-muted-foreground">{data.time}</span>
          <div
            className="max-w-[75%] rounded-2xl rounded-tr-sm px-3.5 py-2 shadow-sm"
            style={{ backgroundColor: 'hsl(var(--chat-bubble-self))' }}
          >
            <p className="text-[13px] leading-relaxed text-foreground">{data.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      <div className="min-w-0 max-w-[85%]">
        <div className="flex items-end gap-1.5">
          <div
            className="rounded-2xl rounded-tl-sm px-3.5 py-2 shadow-sm"
            style={{ backgroundColor: 'hsl(var(--chat-bubble-other))' }}
          >
            <p className="text-[13px] leading-relaxed text-foreground">{data.message}</p>

            {/* Task reference */}
            {data.taskTitle && (
              <button
                type="button"
                onClick={() => setTaskExpanded(!taskExpanded)}
                className="mt-1.5 flex w-full items-center gap-1.5 rounded-lg border border-border/50 bg-secondary/40 px-2 py-1 text-left transition-colors hover:bg-secondary/60"
              >
                <LinkIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-xs font-medium text-foreground">{data.taskTitle}</span>
                {taskExpanded
                  ? <ChevronUp className="h-3 w-3 shrink-0 text-muted-foreground" />
                  : <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />}
              </button>
            )}
            {taskExpanded && data.taskContent && (
              <div className="mt-1 rounded-lg bg-secondary/30 px-2 py-1.5 text-xs leading-relaxed text-muted-foreground">
                {data.taskContent}
              </div>
            )}

            {data.relatedKanbanId && (
              <button
                type="button"
                onClick={() => onViewDetail(data.relatedKanbanId!)}
                className="mt-1 text-xs font-medium text-primary hover:underline"
              >
                {'칸반 카드 보기 >'}
              </button>
            )}
          </div>
          <span className="shrink-0 pb-0.5 text-[11px] text-muted-foreground">{data.time}</span>
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
  const { chatRooms, kanbanCards, addChatMessage } = useAdminStore()
  const [activeRoomId, setActiveRoomId] = useState(chatRooms[0]?.id ?? '')
  const [inputText, setInputText] = useState('')
  const [taggedKanbanId, setTaggedKanbanId] = useState<string | null>(null)
  const [showTagPicker, setShowTagPicker] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeRoom = chatRooms.find((r) => r.id === activeRoomId)

  // Kanban cards relevant to the active room's operator
  const roomKanbanCards = activeRoom
    ? kanbanCards.filter((c) => c.operatorName === activeRoom.operatorName)
    : []

  const taggedCard = taggedKanbanId ? kanbanCards.find((c) => c.id === taggedKanbanId) : null

  // Auto-scroll when active room changes or messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeRoomId, activeRoom?.messages.length])

  const handleSend = () => {
    if (!inputText.trim() || !activeRoomId) return
    addChatMessage(activeRoomId, inputText.trim(), taggedKanbanId ?? undefined)
    setInputText('')
    setTaggedKanbanId(null)
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">{'운영매 실시간 채팅'}</h2>

      <div className="flex overflow-hidden rounded-2xl border border-border shadow-sm" style={{ height: '480px' }}>
        {/* Left: Room list */}
        <div className="flex w-[240px] shrink-0 flex-col border-r border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <span className="text-sm font-semibold text-foreground">{'채팅'}</span>
            <span className="ml-1.5 text-xs text-muted-foreground">{chatRooms.length}</span>
          </div>
          <div className="flex-1 space-y-0.5 overflow-y-auto p-2">
            {chatRooms.map((room) => (
              <RoomListItem
                key={room.id}
                room={room}
                isActive={room.id === activeRoomId}
                onClick={() => { setActiveRoomId(room.id); setTaggedKanbanId(null); setShowTagPicker(false) }}
              />
            ))}
          </div>
        </div>

        {/* Right: Chat window */}
        <div className="flex flex-1 flex-col">
          {activeRoom ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-secondary text-xs font-bold text-foreground">
                  {activeRoom.operatorName.charAt(0)}
                </div>
                <div>
                  <span className="text-sm font-bold text-foreground">{activeRoom.operatorName}</span>
                  <div className="flex gap-1">
                    {activeRoom.tracks.map((t) => (
                      <span key={t} className="text-[11px] text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-3"
                style={{ backgroundColor: 'hsl(var(--chat-bg))' }}
              >
                {activeRoom.messages.map((msg) => (
                  <Bubble
                    key={msg.id}
                    data={msg}
                    onViewDetail={(id) => onViewKanbanDetail?.(id)}
                  />
                ))}
              </div>

              {/* Tagged task indicator */}
              {taggedCard && (
                <div className="flex items-center gap-2 border-t border-border bg-secondary/30 px-4 py-1.5">
                  <Tag className="h-3 w-3 text-primary" />
                  <span className="flex-1 truncate text-xs font-medium text-foreground">
                    {'Task: '}{taggedCard.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTaggedKanbanId(null)}
                    className="rounded p-0.5 text-muted-foreground hover:bg-secondary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Tag picker dropdown */}
              {showTagPicker && roomKanbanCards.length > 0 && (
                <div className="border-t border-border bg-card px-3 py-2">
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">{'Task 태그 선택'}</p>
                  <div className="max-h-[120px] space-y-1 overflow-y-auto">
                    {roomKanbanCards.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { setTaggedKanbanId(c.id); setShowTagPicker(false) }}
                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-secondary ${
                          taggedKanbanId === c.id ? 'bg-primary/10 font-semibold' : ''
                        }`}
                      >
                        <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: c.trackColor }} />
                        <span className="flex-1 truncate text-foreground">{c.title}</span>
                        <span className="shrink-0 text-muted-foreground">{c.trackName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setShowTagPicker(!showTagPicker)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                    showTagPicker || taggedKanbanId
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                  aria-label="Task 태그"
                >
                  <Tag className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder={taggedCard ? `${taggedCard.title}에 대한 메시지...` : '메시지를 입력하세요...'}
                  className="flex-1 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  disabled={!inputText.trim()}
                  onClick={handleSend}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors disabled:opacity-40"
                  aria-label="메시지 전송"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
              <MessageSquare className="h-10 w-10" />
              <p className="text-sm">{'채팅방을 선택하세요'}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
