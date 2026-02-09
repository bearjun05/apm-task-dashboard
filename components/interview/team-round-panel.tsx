'use client'

import React from "react"

import { useInterviewStore } from '@/lib/interview-store'
import { cn } from '@/lib/utils'
import { Search, AlertTriangle } from 'lucide-react'
import { useState, useCallback, useRef, useEffect } from 'react'
import type { Student } from '@/lib/types'

export function TeamRoundPanel() {
  const {
    students,
    roundChecks,
    selectedStudentId,
    period,
    setPeriod,
    selectStudent,
    toggleAbsent,
    toggleHealth,
    toggleProgress,
    updateSpecialNote,
  } = useInterviewStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const highlightRef = useRef<HTMLTableRowElement>(null)

  // Debounce search
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 300)
  }, [])

  // Scroll to selected student
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedStudentId])

  // Group students by team
  const teamMap = new Map<number, Student[]>()
  for (const s of students) {
    if (!teamMap.has(s.teamNumber)) teamMap.set(s.teamNumber, [])
    teamMap.get(s.teamNumber)!.push(s)
  }
  const teams = Array.from(teamMap.entries()).sort(([a], [b]) => a - b)

  // Filter by search
  const matchingStudentIds = new Set<string>()
  const matchingTeams = new Set<number>()

  if (debouncedQuery.trim()) {
    const q = debouncedQuery.trim().toLowerCase()
    // Check team number search
    const teamNumMatch = q.match(/^(\d+)/)
    if (teamNumMatch) {
      const teamNum = Number(teamNumMatch[1])
      if (teamMap.has(teamNum)) matchingTeams.add(teamNum)
    }
    // Check student name search
    for (const s of students) {
      if (s.name.toLowerCase().includes(q)) {
        matchingStudentIds.add(s.id)
        matchingTeams.add(s.teamNumber)
      }
    }
  }

  const filteredTeams = debouncedQuery.trim()
    ? teams.filter(([teamNum]) => matchingTeams.has(teamNum))
    : teams

  const todayStr = new Date().toISOString().split('T')[0]

  function getCheck(studentId: string) {
    return roundChecks.find(
      (c) => c.studentId === studentId && c.date === todayStr && c.period === period,
    )
  }

  function handleStudentAction(studentId: string) {
    selectStudent(studentId)
  }

  function handleNoteKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    studentId: string,
  ) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      ;(e.target as HTMLTextAreaElement).blur()
    }
  }

  return (
    <div className="flex h-full flex-col border-r border-gray-200">
      {/* Panel header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 px-4">
        <h2 className="text-sm font-semibold text-gray-900">{'팀 순회'}</h2>

        {/* Period toggle */}
        <div className="flex items-center rounded-md bg-gray-100 p-0.5">
          <button
            type="button"
            onClick={() => setPeriod('morning')}
            className={cn(
              'rounded px-3 py-1 text-xs font-medium transition-all',
              period === 'morning'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {'오전'}
          </button>
          <button
            type="button"
            onClick={() => setPeriod('afternoon')}
            className={cn(
              'rounded px-3 py-1 text-xs font-medium transition-all',
              period === 'afternoon'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {'오후'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 border-b border-gray-200 px-4 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="팀 번호 또는 수강생 이름 검색"
            className="w-full rounded-md border border-gray-200 bg-background py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Teams list */}
      <div className="flex-1 overflow-y-auto">
        {filteredTeams.map(([teamNum, teamStudents]) => (
          <div key={teamNum} className="border-b border-gray-200">
            {/* Team header */}
            <div className="bg-gray-50 px-4 py-2">
              <span className="text-sm font-semibold text-gray-900">
                {teamNum}{'팀'}
              </span>
              <span className="ml-1.5 text-xs text-gray-500">
                {'('}{teamStudents.length}{'명)'}
              </span>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-4 py-1.5 text-left text-xs font-medium text-gray-500">{'이름'}</th>
                  {period === 'morning' ? (
                    <>
                      <th className="w-12 px-2 py-1.5 text-center text-xs font-medium text-gray-500">{'결석'}</th>
                      <th className="w-12 px-2 py-1.5 text-center text-xs font-medium text-gray-500">{'헬스'}</th>
                    </>
                  ) : (
                    <th className="w-12 px-2 py-1.5 text-center text-xs font-medium text-gray-500">{'진도'}</th>
                  )}
                  <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500">{'특이사항'}</th>
                </tr>
              </thead>
              <tbody>
                {teamStudents.map((student) => {
                  const check = getCheck(student.id)
                  const isSelected = selectedStudentId === student.id
                  const isSearchMatch =
                    debouncedQuery.trim() && matchingStudentIds.has(student.id)

                  return (
                    <tr
                      key={student.id}
                      ref={isSelected ? highlightRef : undefined}
                      className={cn(
                        'border-b border-gray-100 transition-colors last:border-0',
                        isSelected
                          ? 'border-l-[3px] border-l-primary bg-blue-50/60'
                          : isSearchMatch
                            ? 'bg-blue-50/40'
                            : 'hover:bg-gray-50',
                      )}
                    >
                      {/* Name */}
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleStudentAction(student.id)}
                          className="flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-primary"
                        >
                          {student.name}
                          {student.consecutiveAbsentDays >= 2 && (
                            <span title={`${student.consecutiveAbsentDays}일 연속 결석`}>
                              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                            </span>
                          )}
                        </button>
                      </td>

                      {period === 'morning' ? (
                        <>
                          {/* Absent checkbox */}
                          <td className="px-2 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={check?.isAbsent ?? false}
                              onChange={() => {
                                toggleAbsent(student.id)
                                handleStudentAction(student.id)
                              }}
                              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary accent-primary focus:ring-primary/20"
                              aria-label={`${student.name} 결석`}
                            />
                          </td>
                          {/* Health checkbox */}
                          <td className="px-2 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={check?.healthCheck ?? false}
                              onChange={() => {
                                toggleHealth(student.id)
                                handleStudentAction(student.id)
                              }}
                              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary accent-primary focus:ring-primary/20"
                              aria-label={`${student.name} 헬스체크`}
                            />
                          </td>
                        </>
                      ) : (
                        /* Progress checkbox */
                        <td className="px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={check?.progressCheck ?? false}
                            onChange={() => {
                              toggleProgress(student.id)
                              handleStudentAction(student.id)
                            }}
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary accent-primary focus:ring-primary/20"
                            aria-label={`${student.name} 진도체크`}
                          />
                        </td>
                      )}

                      {/* Special note */}
                      <td className="px-2 py-1.5">
                        <textarea
                          rows={1}
                          defaultValue={check?.specialNote ?? ''}
                          onFocus={() => handleStudentAction(student.id)}
                          onBlur={(e) => updateSpecialNote(student.id, e.target.value)}
                          onKeyDown={(e) => handleNoteKeyDown(e, student.id)}
                          placeholder=""
                          className="w-full resize-none rounded border border-gray-200 px-2 py-1 text-xs text-gray-900 placeholder:text-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
