'use client'

import { useState } from 'react'
import { useAdminStore } from '@/lib/admin-store'
import { AdminSidebar } from './admin-sidebar'
import { ArrowLeft, Bell, AlertTriangle, MessageSquare } from 'lucide-react'

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

export function TrackDetailDashboard() {
  const { tracks, selectedTrackId, staffCards, goBack, navigateTo } = useAdminStore()
  const [activeMenu, setActiveMenu] = useState('dashboard')

  const track = tracks.find((t) => t.id === selectedTrackId) ?? tracks[0]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{track.name}</span>
            <span className="text-border">{'|'}</span>
            <span>{'2026.02.01 ~ 2026.07.31'}</span>
            <span className="text-border">{'|'}</span>
            <span>{'담당: 이운영'}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {'전체 트랙 목록'}
            </button>
            <button
              type="button"
              className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="알림"
            >
              <Bell className="h-[18px] w-[18px]" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Today's Summary */}
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground">{'오늘의 요약'}</h2>

            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{'학관매 평균 업무 완료율'}</span>
                  <span className="font-medium text-foreground">{track.staffAvgCompletion}{'%'}</span>
                </div>
                <ProgressBar value={track.staffAvgCompletion} className="mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{'이슈 처리율'}</span>
                  <span className="font-medium text-foreground">{track.issueResolutionRate}{'% (19/20)'}</span>
                </div>
                <ProgressBar value={track.issueResolutionRate} className="mt-2" />
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {'긴급 알림'}
              </h3>
              <ul className="space-y-2 text-sm">
                {track.urgentIssues > 0 && (
                  <li className="flex items-center gap-2">
                    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                      {'긴급'}
                    </span>
                    <span className="text-foreground">{'긴급 이슈 '}{track.urgentIssues}{'건 (교육장 에어컨 등)'}</span>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                    {'대기'}
                  </span>
                  <span className="text-foreground">{'미확인 요청 '}{track.pendingRequests}{'건'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                    {'미완료'}
                  </span>
                  <span className="text-foreground">{'팀순회 미완료: 이학관 (오전)'}</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Staff Status */}
          <section>
            <h2 className="mb-4 text-base font-semibold text-foreground">
              {'학관매 현황 ('}{staffCards.length}{'명)'}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {staffCards.map((staff) => (
                <div
                  key={staff.id}
                  className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">{staff.name}</h3>
                    {staff.isWarning && (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{'업무 완료율'}</span>
                      <span className="font-medium text-foreground">
                        {staff.taskCompletionRate}{'% ('}{staff.taskCompleted}{'/'}{staff.taskTotal}{')'}
                      </span>
                    </div>
                    <ProgressBar value={staff.taskCompletionRate} className="mt-2" />
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm">
                    {staff.unreadMessages > 0 && (
                      <div className="flex items-center gap-1.5 text-primary">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{'안읽은 대화: '}{staff.unreadMessages}{'건'}</span>
                      </div>
                    )}
                    {staff.missedRound && (
                      <div className="flex items-center gap-1.5 text-destructive">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>{'미완료 팀순회: '}{staff.missedRound}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('staff-detail', { staffId: staff.id })}
                    className="mt-4 w-full rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {'상세보기'}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Student Status */}
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-foreground">{'수강생 현황'}</h2>
            <div className="mt-3 space-y-2 text-sm">
              <p className="text-foreground">
                {'총 '}<strong>{track.studentCount}{'명'}</strong>{' | 출석률 95%'}
              </p>
              <p className="text-destructive">
                {'2일 이상 연속 결석: 3명'}
              </p>
            </div>
            <button
              type="button"
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80"
            >
              {'자세히 보기'}
            </button>
          </section>
        </main>
      </div>
    </div>
  )
}
