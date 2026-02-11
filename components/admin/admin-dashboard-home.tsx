'use client'

import { useAdminStore } from '@/lib/admin-store'
import { Bell } from 'lucide-react'
import { KanbanBoard } from './kanban-board'
import { OperatorChatSection } from './operator-chat-section'
import { PlannerTrackCards } from './planner-track-cards'

export function AdminDashboardHome() {
  const { plannerTracks } = useAdminStore()

  // Build the header track summary text: show up to 4, then "외 N개"
  const MAX_SHOWN = 4
  const trackSummary = plannerTracks
    .slice(0, MAX_SHOWN)
    .map((t) => {
      const shortName = t.name.replace(' 트랙', '').replace('트랙 ', '')
      const periodShort = t.period.replace(/2026\./g, '').replace(/ /g, '')
      return `${shortName} (${periodShort})`
    })
    .join(' | ')
  const extraCount = plannerTracks.length - MAX_SHOWN
  const trackLabel = extraCount > 0 ? `${trackSummary} | 외 ${extraCount}개` : trackSummary

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-border bg-card px-6">
        {/* Left */}
        <h1 className="text-base font-semibold text-foreground">{'APM 운영 관리'}</h1>

        {/* Center: track summary */}
        <div className="hidden text-xs text-muted-foreground lg:block">
          <span className="font-medium text-foreground">
            {'담당 트랙 '}{plannerTracks.length}{'개: '}
          </span>
          {trackLabel}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="알림"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {'3'}
            </span>
          </button>
          <span className="text-sm text-muted-foreground">{'이운영 (운기매)'}</span>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 space-y-6 overflow-y-auto p-6">
        {/* Section 1: Kanban Board */}
        <KanbanBoard />

        {/* Section 2: Operator Chat -- primary section, large */}
        <OperatorChatSection />

        {/* Section 3: Track Cards -- compact horizontal strip */}
        <PlannerTrackCards />
      </main>
    </div>
  )
}
