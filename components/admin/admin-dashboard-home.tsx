'use client'

import Link from 'next/link'
import { useAdminStore } from '@/lib/admin-store'
import { Bell } from 'lucide-react'

function ProgressBar({ value, className }: { value: number; className?: string }) {
  const color =
    value >= 80 ? 'bg-success' : value >= 60 ? 'bg-warning' : 'bg-destructive'
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-secondary ${className ?? ''}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

export function AdminDashboardHome() {
  const { operators, tracks, userRole } = useAdminStore()

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-border bg-card px-6">
        <h1 className="text-base font-semibold text-foreground">{'APM 관리자'}</h1>
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
      <main className="flex-1 overflow-y-auto p-6">
        {/* Operator Cards - only for operator_manager */}
        {userRole === 'operator_manager' && (
          <section className="mb-8">
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">{'담당 운영매'}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {operators.map((op) => (
                <Link
                  key={op.id}
                  href={`/admin/operators/${op.id}`}
                  className="block rounded-lg border border-border bg-card p-5 text-left transition-shadow hover:shadow-md"
                >
                  <h3 className="text-base font-semibold text-foreground">{op.displayName}</h3>

                  {/* Task completion */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{'업무 완료율'}</span>
                      <span className="font-medium text-foreground">
                        {op.taskCompletionRate}{'% ('}{op.taskCompleted}{'/'}{op.taskTotal}{')'}
                      </span>
                    </div>
                    <ProgressBar value={op.taskCompletionRate} className="mt-2" />
                  </div>

                  {/* Tracks */}
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      {'담당 트랙: '}{op.tracks.map((t) => t.trackName).join(', ')}
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {op.tracks.map((track) => (
                        <div key={track.trackName} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="min-w-[52px] font-medium text-foreground">{track.trackName}</span>
                          <span>{'학관매 평균 '}{track.staffAvgCompletion}{'%'}</span>
                          <span className="text-border">{'|'}</span>
                          <span>{'이슈 처리율 '}{track.issueResolutionRate}{'%'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Divider */}
        {userRole === 'operator_manager' && (
          <div className="mb-8 border-t border-border" />
        )}

        {/* Track Cards */}
        <section>
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">{'내 담당 트랙'}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <Link
                key={track.id}
                href={`/admin/tracks/${track.id}`}
                className={`block rounded-lg border bg-card p-5 text-left transition-shadow hover:shadow-md ${
                  track.isOwned ? 'border-primary border-2' : 'border-border'
                }`}
              >
                <h3 className="text-base font-semibold text-foreground">{track.name}</h3>

                {/* Stats */}
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{'학관매 평균 업무 완료율'}</span>
                      <span className="font-medium text-foreground">{track.staffAvgCompletion}{'%'}</span>
                    </div>
                    <ProgressBar value={track.staffAvgCompletion} className="mt-1.5" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{'이슈 처리율'}</span>
                    <span className="font-medium text-foreground">{track.issueResolutionRate}{'%'}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {track.urgentIssues > 0 && (
                      <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                        {'긴급 이슈 '}{track.urgentIssues}{'건'}
                      </span>
                    )}
                    <span className="text-muted-foreground">
                      {'미확인 요청 '}{track.pendingRequests}{'건'}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>{'학관매 '}{track.staffCount}{'명'}</span>
                  <span className="text-border">{'|'}</span>
                  <span>{'수강생 '}{track.studentCount}{'명'}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
