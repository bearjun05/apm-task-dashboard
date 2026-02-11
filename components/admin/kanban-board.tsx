'use client'

import { useState } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd'
import { useAdminStore } from '@/lib/admin-store'
import type { KanbanCard, KanbanStatus } from '@/lib/admin-mock-data'
import { X, Send, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'

const COLUMNS: { id: KanbanStatus; label: string }[] = [
  { id: 'waiting', label: '대기중' },
  { id: 'in-progress', label: '진행중' },
  { id: 'done', label: '완료' },
]

/* ------------------------------------------------------------------ */
/*  Card Detail Modal                                                  */
/* ------------------------------------------------------------------ */
function CardDetailModal({
  card,
  onClose,
}: {
  card: KanbanCard
  onClose: () => void
}) {
  const { addKanbanReply, updateKanbanCardStatus } = useAdminStore()
  const [reply, setReply] = useState('')
  const [status, setStatus] = useState<KanbanStatus>(card.status)

  const handleSend = () => {
    if (!reply.trim()) return
    addKanbanReply(card.id, reply.trim())
    setReply('')
    if (status === 'waiting') setStatus('in-progress')
  }

  const handleStatusChange = (newStatus: KanbanStatus) => {
    setStatus(newStatus)
    updateKanbanCardStatus(card.id, newStatus)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Meta */}
        <div className="space-y-1.5 border-b border-border px-5 py-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{'트랙:'}</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: card.trackColor }} />
              {card.trackName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{'작성자:'}</span>
            <span className="font-medium text-foreground">{card.operatorName}{' (운영매)'}</span>
          </div>
          {card.isUrgent && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{'긴급도:'}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                <AlertTriangle className="h-3 w-3" />
                {'긴급'}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{'작성일:'}</span>
            <span className="text-foreground">{card.createdAt}</span>
          </div>
        </div>

        {/* Content */}
        <div className="border-b border-border px-5 py-3">
          <p className="text-sm leading-relaxed text-foreground">{card.content}</p>
        </div>

        {/* Messages */}
        {card.messages.length > 0 && (
          <div className="flex-1 overflow-y-auto border-b border-border px-5 py-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">{'대화 내역'}</p>
            <div className="space-y-2">
              {card.messages.map((m) => (
                <div key={m.id} className={`rounded-lg p-2.5 text-sm ${m.isSelf ? 'ml-8 bg-primary/10' : 'mr-8 bg-secondary'}`}>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{m.authorName}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="mt-1 text-foreground">{m.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply + Status */}
        <div className="px-5 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="답변을 입력하세요..."
              className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!reply.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {'전송'}
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{'상태:'}</span>
            {COLUMNS.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => handleStatusChange(col.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  status === col.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Completed Projects View                                            */
/* ------------------------------------------------------------------ */
function CompletedProjectsView({ cards }: { cards: KanbanCard[] }) {
  const [weekOffset, setWeekOffset] = useState(0)

  const baseDate = new Date(2026, 1, 11) // pinned date matching mock-data.ts
  const currentWeekStart = new Date(baseDate)
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1 + weekOffset * 7)

  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(currentWeekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  const dayLabels = ['월요일', '화요일', '수요일', '목요일', '금요일']

  const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`
  const weekLabel = `${baseDate.getFullYear()}년 ${currentWeekStart.getMonth() + 1}월 ${Math.ceil(currentWeekStart.getDate() / 7)}주차`

  const getCardsForDay = (day: Date) => {
    const dayStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
    return cards.filter((c) => c.status === 'done' && c.createdAt.startsWith(dayStr))
  }

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-center gap-3">
        <button type="button" onClick={() => setWeekOffset((p) => p - 1)} className="rounded-md p-1 text-muted-foreground hover:bg-secondary">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-foreground">{weekLabel}</span>
        <button type="button" onClick={() => setWeekOffset((p) => p + 1)} className="rounded-md p-1 text-muted-foreground hover:bg-secondary">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Days */}
      {weekDays.map((day, idx) => {
        const dayCards = getCardsForDay(day)
        return (
          <div key={idx}>
            <p className="mb-2 text-sm font-medium text-foreground">
              {dayLabels[idx]}{' '}{formatDate(day)}
              <span className="ml-1.5 text-muted-foreground">{'('}{dayCards.length}{'건)'}</span>
            </p>
            {dayCards.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {dayCards.map((c) => (
                  <div key={c.id} className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm">
                    <span className="text-xs text-muted-foreground">{c.trackName}</span>
                    <p className="font-medium text-foreground">{c.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">{'완료된 항목 없음'}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  KanbanBoard (main export)                                          */
/* ------------------------------------------------------------------ */
export function KanbanBoard() {
  const { kanbanCards, moveKanbanCard } = useAdminStore()
  const [showCompleted, setShowCompleted] = useState(false)
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const newStatus = result.destination.droppableId as KanbanStatus
    moveKanbanCard(result.draggableId, newStatus)
  }

  const getColumnCards = (status: KanbanStatus) =>
    kanbanCards.filter((c) => c.status === status)

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{'운영매 요청사항 & 업무'}</h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          {'완료된 프로젝트 전체보기'}
        </label>
      </div>

      {showCompleted ? (
        <CompletedProjectsView cards={kanbanCards} />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-3 gap-4">
            {COLUMNS.map((col) => {
              const colCards = getColumnCards(col.id)
              return (
                <div key={col.id} className="rounded-xl bg-secondary/50 p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {colCards.length}{'건'}
                    </span>
                  </div>

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[120px] space-y-2 rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                      >
                        {colCards.map((card, index) => (
                          <Draggable key={card.id} draggableId={card.id} index={index}>
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                onClick={() => setSelectedCard(card)}
                                className={`cursor-pointer rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-md ${dragSnapshot.isDragging ? 'shadow-lg' : ''}`}
                              >
                                {/* Track color dot + track name + operator */}
                                <div className="flex items-center gap-2">
                                  <span
                                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: card.trackColor }}
                                  />
                                  <span className="text-xs text-muted-foreground">{card.trackName}</span>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">{card.operatorName}</p>

                                {/* Title */}
                                <p className="mt-2 text-sm font-semibold text-foreground">{card.title}</p>

                                {/* Footer: time + urgent */}
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">{card.timeAgo}</span>
                                  {card.isUrgent && (
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">
                                      <AlertTriangle className="h-2.5 w-2.5" />
                                      {'긴급'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      )}

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </section>
  )
}
