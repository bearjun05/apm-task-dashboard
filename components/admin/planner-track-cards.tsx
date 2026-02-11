'use client'

import Link from 'next/link'
import { useAdminStore } from '@/lib/admin-store'
import { Users, GraduationCap, BookOpen } from 'lucide-react'

function MiniProgress({ value, color }: { value: number; color?: string }) {
  const barColor =
    color ?? (value >= 80 ? 'bg-success' : value >= 60 ? 'bg-warning' : 'bg-destructive')
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

export function PlannerTrackCards() {
  const { plannerTracks } = useAdminStore()

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        {'담당 트랙'}{' '}
        <span className="font-normal text-muted-foreground">
          {plannerTracks.length}{'개'}
        </span>
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {plannerTracks.map((track) => (
          <Link
            key={track.id}
            href={`/admin/tracks/${track.id}`}
            className="flex min-w-[280px] max-w-[340px] shrink-0 flex-col rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
            style={{ borderLeftWidth: '3px', borderLeftColor: track.color }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">{track.name}</h3>
              <span className="text-[11px] text-muted-foreground">{track.period.replace(/2026\./g, '').replace(/ /g, '')}</span>
            </div>

            {/* Completion */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{'완료율'}</span>
                <span className="font-semibold text-foreground">{track.completionRate}{'%'}</span>
              </div>
              <MiniProgress value={track.completionRate} />
            </div>

            {/* Issue summary inline */}
            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>{'이슈'} <span className="font-medium text-foreground">{track.issueSummary.total}</span></span>
              <span className="text-border">{'/'}</span>
              <span>{'대기'} <span className="text-warning font-medium">{track.issueSummary.waiting}</span></span>
              <span>{'진행'} <span className="text-primary font-medium">{track.issueSummary.inProgress}</span></span>
              <span>{'완료'} <span className="text-success font-medium">{track.issueSummary.done}</span></span>
            </div>

            {/* People row */}
            <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {'학관매 '}{track.staffCount}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                {'수강생 '}{track.studentCount}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {'튜터 '}{track.tutorCount}
              </span>
            </div>

            {/* Operator mini */}
            {track.operator && (
              <div className="mt-2.5 rounded-md bg-secondary/60 px-2.5 py-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-foreground">{'운영매: '}{track.operator.name}</span>
                  <Link
                    href={`/admin/operators/${track.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:underline"
                  >
                    {'상세'}
                  </Link>
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{'업무 '}{track.operator.taskCompletionRate}{'%'}</span>
                  <span>{'이슈 '}{track.operator.issueResolved}{'/'}{track.operator.issueTotal}</span>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
