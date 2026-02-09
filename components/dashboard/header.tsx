'use client'

import { Bell } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { useState, useRef, useEffect } from 'react'

export function DashboardHeader() {
  const { timedTasks, todayTasks, notices } = useDashboardStore()
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const [dateStr, setDateStr] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const allTasks = [...timedTasks, ...todayTasks]
  const completedCount = allTasks.filter((t) => t.isCompleted).length
  const totalCount = allTasks.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const unreadNotices = notices.filter((n) => !n.isRead)

  useEffect(() => {
    const today = new Date()
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
    setDateStr(`${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${dayNames[today.getDay()]}`)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-card px-6 py-3">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900">
            {'AI 트랙 7기'}
          </h1>
          <p className="text-sm text-gray-500">{dateStr}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {totalCount}{'개 중 '}{completedCount}{'개 완료'}
          </span>
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-success transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-500">{progressPercent}{'%'}</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="알림"
          >
            <Bell className="h-5 w-5" />
            {unreadNotices.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {unreadNotices.length}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-lg border border-gray-200 bg-card shadow-lg">
              <div className="border-b border-gray-200 px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">{'알림'}</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {unreadNotices.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-gray-500">
                    {'새로운 알림이 없습니다'}
                  </p>
                ) : (
                  unreadNotices.map((notice) => (
                    <div
                      key={notice.id}
                      className="border-b border-gray-100 px-4 py-3 last:border-0"
                    >
                      <p className="text-sm font-medium text-gray-900">{notice.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                        {notice.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
