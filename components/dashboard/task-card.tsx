'use client'

import { Star, MessageCircle, FileText, AlertTriangle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useDashboardStore } from '@/lib/store'
import type { Task } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface TaskCardProps {
  task: Task
  compact?: boolean
  showTime?: boolean
}

function getDDay(endDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function checkOverdue(task: Task): boolean {
  if (task.isCompleted) return false
  if (!task.dueTime) return false
  const now = new Date()
  const [hours, minutes] = task.dueTime.split(':').map(Number)
  const due = new Date()
  due.setHours(hours, minutes, 0, 0)
  return now > due
}

export function TaskCard({ task, compact = false, showTime = false }: TaskCardProps) {
  const { toggleTaskComplete, toggleTaskImportant, updateTaskDetail } = useDashboardStore()
  const [showDetail, setShowDetail] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [detailText, setDetailText] = useState(task.detailContent || '')
  const [overdue, setOverdue] = useState(false)

  useEffect(() => {
    setOverdue(checkOverdue(task))
  }, [task])

  const dDay = task.endDate ? getDDay(task.endDate) : null

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors',
          task.isCompleted && 'opacity-60',
          overdue && 'bg-red-50',
        )}
      >
        <Checkbox
          checked={task.isCompleted}
          onCheckedChange={() => toggleTaskComplete(task.id)}
          className="h-3.5 w-3.5"
          aria-label={`${task.title} 완료 표시`}
        />
        <span
          className={cn(
            'text-xs text-gray-900',
            task.isCompleted && 'text-gray-500 line-through',
          )}
        >
          {task.title}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group rounded-lg border bg-card p-3 transition-all duration-200',
        overdue && !task.isCompleted
          ? 'border-destructive/50 bg-red-50/30'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm',
        task.isCompleted && 'border-gray-200 bg-gray-50 opacity-70',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => toggleTaskImportant(task.id)}
          className={cn(
            'mt-0.5 shrink-0 transition-colors',
            task.isImportant ? 'text-amber-400' : 'text-gray-300 hover:text-gray-400',
          )}
          aria-label={task.isImportant ? '중요 표시 해제' : '중요 표시'}
        >
          <Star className={cn('h-4 w-4', task.isImportant && 'fill-current')} />
        </button>

        <Checkbox
          checked={task.isCompleted}
          onCheckedChange={() => toggleTaskComplete(task.id)}
          className="mt-0.5 shrink-0"
          aria-label={`${task.title} 완료 표시`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-medium text-gray-900',
                task.isCompleted && 'text-gray-500 line-through',
              )}
            >
              {task.title}
            </span>
            {overdue && !task.isCompleted && (
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-destructive" />
            )}
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
            {showTime && task.dueTime && <span>{task.dueTime}</span>}
            {task.endDate && (
              <span
                className={cn(
                  dDay !== null && dDay <= 2 && 'font-medium text-destructive',
                )}
              >
                {'D'}{dDay !== null && dDay >= 0 ? `-${dDay}` : `+${Math.abs(dDay!)}`}
              </span>
            )}
            {task.startDate && task.endDate && (
              <span>
                {new Date(task.startDate).getMonth() + 1}/{new Date(task.startDate).getDate()}
                {' ~ '}
                {new Date(task.endDate).getMonth() + 1}/{new Date(task.endDate).getDate()}
              </span>
            )}
          </div>

          {task.detailContent && !showDetail && (
            <p className="mt-1.5 line-clamp-1 text-xs text-gray-500">
              {task.detailContent}
            </p>
          )}
        </div>
      </div>

      {/* Action icons */}
      <div className="mt-2 flex items-center gap-1 border-t border-gray-100 pt-2">
        <button
          type="button"
          onClick={() => setShowChat(!showChat)}
          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="채팅"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {task.chatMessages.length > 0 && (
            <span className="ml-0.5 text-[10px]">{task.chatMessages.length}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setShowDetail(!showDetail)}
          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="상세내용"
        >
          <FileText className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Chat panel */}
      {showChat && (
        <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3">
          <div className="max-h-40 space-y-2 overflow-y-auto">
            {task.chatMessages.length === 0 ? (
              <p className="text-center text-xs text-gray-400">{'메시지가 없습니다'}</p>
            ) : (
              task.chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.isFromManager ? 'justify-start' : 'justify-end',
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-lg px-3 py-1.5 text-xs',
                      msg.isFromManager
                        ? 'bg-gray-200 text-gray-900'
                        : 'bg-primary text-primary-foreground',
                    )}
                  >
                    <p className="mb-0.5 text-[10px] font-medium opacity-70">
                      {msg.authorName}
                    </p>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Detail panel */}
      {showDetail && (
        <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3">
          <textarea
            value={detailText}
            onChange={(e) => setDetailText(e.target.value)}
            placeholder="상세 내용을 입력하세요..."
            className="w-full resize-none rounded-md border border-gray-300 bg-card px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            rows={3}
          />
          <button
            type="button"
            onClick={() => {
              updateTaskDetail(task.id, detailText)
              setShowDetail(false)
            }}
            className="mt-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {'저장'}
          </button>
        </div>
      )}
    </div>
  )
}
