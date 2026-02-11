'use client'

import Link from 'next/link'
import { useAdminStore } from '@/lib/admin-store'

function ProgressBar({ value, color }: { value: number; color?: string }) {
  const barColor =
    color ?? (value >= 80 ? 'bg-success' : value >= 60 ? 'bg-warning' : 'bg-destructive')
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
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
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {'담당 트랙'}{' '}
        <span className="text-sm font-normal text-muted-foreground">
          {'('}{plannerTracks.length}{'개)'}
        </span>
      </h2>

      <div className="space-y-4">
        {plannerTracks.map((track) => (
          <Link
            key={track.id}
            href={`/admin/tracks/${track.id}`}
            className="group flex overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
            style={{ borderLeftWidth: '4px', borderLeftColor: track.color }}
          >
            {/* Left side: track info (65%) */}
            <div className="flex-[65] p-5">
              <h3 className="text-base font-bold text-foreground">{track.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{track.period}</p>

              {/* Completion Rate */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{'업무 완료율'}</span>
                  <span className="font-semibold text-foreground">{track.completionRate}{'%'}</span>
                </div>
                <ProgressBar value={track.completionRate} className="mt-1.5" />
              </div>

              {/* Issue Summary */}
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">
                  {'오늘 이슈 현황'}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs">
                  <span className="font-medium text-foreground">{'발생 '}{track.issueSummary.total}{'건'}</span>
                  <span className="text-muted-foreground">
                    {'대기중 '}{track.issueSummary.waiting}{'건'}
                  </span>
                  <span className="text-border">{'|'}</span>
                  <span className="text-muted-foreground">
                    {'진행중 '}{track.issueSummary.inProgress}{'건'}
                  </span>
                  <span className="text-border">{'|'}</span>
                  <span className="text-muted-foreground">
                    {'완료 '}{track.issueSummary.done}{'건'}
                  </span>
                </div>
              </div>

              {/* People */}
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{'학관매 '}<span className="font-medium text-foreground">{track.staffCount}{'명'}</span></span>
                <span>{'수강생 '}<span className="font-medium text-foreground">{track.studentCount}{'명'}</span></span>
                <span>{'튜터 '}<span className="font-medium text-foreground">{track.tutorCount}{'명'}</span></span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-border" />

            {/* Right side: operator info (35%) */}
            <div className="flex flex-[35] flex-col justify-center p-5">
              {track.operator ? (
                <>
                  <p className="text-sm font-semibold text-foreground">
                    {'운영매: '}{track.operator.name}
                  </p>

                  <div className="mt-3 space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{'업무 완료율'}</span>
                        <span className="font-medium text-foreground">{track.operator.taskCompletionRate}{'%'}</span>
                      </div>
                      <ProgressBar value={track.operator.taskCompletionRate} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{'이슈 처리율'}</span>
                        <span className="font-medium text-foreground">
                          {track.operator.issueResolutionRate}{'% ('}{track.operator.issueResolved}{'/'}{track.operator.issueTotal}{')'}
                        </span>
                      </div>
                      <ProgressBar value={track.operator.issueResolutionRate} className="mt-1" />
                    </div>
                  </div>

                  <Link
                    href={`/admin/operators/${track.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 inline-block self-start rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80"
                  >
                    {'상세보기'}
                  </Link>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">{'담당 운영매니저 없음'}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{'업무: 업무 없음'}</p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
