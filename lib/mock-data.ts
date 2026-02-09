import type { Task, Notice, Issue, CalendarEvent } from './types'

const today = new Date()
const todayStr = today.toISOString().split('T')[0]

function addDays(date: Date, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export const mockTimedTasks: Task[] = [
  {
    id: 't1',
    title: '오전 출석체크',
    dueDate: todayStr,
    dueTime: '09:00',
    isCompleted: true,
    isImportant: true,
    type: 'system',
    chatMessages: [],
  },
  {
    id: 't2',
    title: '오전 학습현황 확인',
    dueDate: todayStr,
    dueTime: '10:00',
    isCompleted: false,
    isImportant: false,
    type: 'system',
    chatMessages: [],
  },
  {
    id: 't3',
    title: '점심시간 출석체크',
    dueDate: todayStr,
    dueTime: '13:00',
    isCompleted: false,
    isImportant: true,
    type: 'system',
    chatMessages: [],
  },
  {
    id: 't4',
    title: '팀 프로젝트 진행상황 점검',
    dueDate: todayStr,
    dueTime: '14:00',
    isCompleted: false,
    isImportant: false,
    type: 'system',
    chatMessages: [],
  },
  {
    id: 't5',
    title: '오후 출석체크',
    dueDate: todayStr,
    dueTime: '14:00',
    isCompleted: false,
    isImportant: true,
    type: 'system',
    chatMessages: [],
  },
  {
    id: 't6',
    title: '일일 학습보고서 작성',
    dueDate: todayStr,
    dueTime: '17:00',
    isCompleted: false,
    isImportant: false,
    type: 'system',
    chatMessages: [],
  },
  {
    id: 't7',
    title: '퇴실 출석체크',
    dueDate: todayStr,
    dueTime: '18:00',
    isCompleted: false,
    isImportant: true,
    type: 'system',
    chatMessages: [],
  },
]

export const mockTodayTasks: Task[] = [
  {
    id: 'td1',
    title: '수강생 면담 일정 조율',
    dueDate: todayStr,
    isCompleted: false,
    isImportant: false,
    type: 'manager_request',
    chatMessages: [
      {
        id: 'm1',
        authorId: 'mgr1',
        authorName: '김운영',
        content: '이번 주 내로 면담 일정 잡아주세요.',
        timestamp: new Date(today.getTime() - 3600000).toISOString(),
        isFromManager: true,
      },
    ],
  },
  {
    id: 'td2',
    title: '프로젝트 발표 자료 검토',
    dueDate: todayStr,
    isCompleted: false,
    isImportant: true,
    type: 'manager_request',
    chatMessages: [],
  },
  {
    id: 'td3',
    title: '주간 학습 진도율 정리',
    dueDate: todayStr,
    isCompleted: true,
    isImportant: false,
    type: 'system',
    chatMessages: [],
  },
  {
    id: 'td4',
    title: '수강생 출결 이상자 확인',
    dueDate: todayStr,
    isCompleted: false,
    isImportant: false,
    type: 'system',
    chatMessages: [],
    detailContent: '결석 3회 이상 수강생 면담 필요',
  },
  {
    id: 'td5',
    title: '챕터 과제 제출 현황 점검',
    dueDate: addDays(today, 2),
    startDate: addDays(today, -1),
    endDate: addDays(today, 2),
    isCompleted: false,
    isImportant: false,
    type: 'period',
    chatMessages: [],
  },
  {
    id: 'td6',
    title: '중간평가 준비 안내',
    dueDate: addDays(today, 1),
    startDate: todayStr,
    endDate: addDays(today, 1),
    isCompleted: false,
    isImportant: true,
    type: 'period',
    chatMessages: [],
  },
  {
    id: 'td7',
    title: '교육장 환경 점검',
    dueDate: todayStr,
    isCompleted: false,
    isImportant: false,
    type: 'self_added',
    chatMessages: [],
  },
  {
    id: 'td8',
    title: '수강생 간식 발주',
    dueDate: todayStr,
    isCompleted: true,
    isImportant: false,
    type: 'self_added',
    chatMessages: [],
  },
]

export const mockNotices: Notice[] = [
  {
    id: 'n1',
    title: '2월 둘째주 운영 안내',
    content: '이번 주 수요일 오후 2시에 전체 운영회의가 있습니다. 각 트랙별 현황 보고를 준비해주세요.',
    authorId: 'mgr1',
    authorName: '김운영',
    isGlobal: true,
    isRead: false,
    timestamp: new Date(today.getTime() - 7200000).toISOString(),
    replies: [],
  },
  {
    id: 'n2',
    title: '수강생 면담 보고서 제출',
    content: '지난주 면담 진행한 수강생들의 보고서를 금요일까지 제출해주세요.',
    authorId: 'mgr2',
    authorName: '박기획',
    isGlobal: false,
    isRead: false,
    timestamp: new Date(today.getTime() - 3600000).toISOString(),
    replies: [
      {
        id: 'r1',
        authorId: 'me',
        authorName: '나',
        content: '네, 확인했습니다. 목요일까지 제출하겠습니다.',
        timestamp: new Date(today.getTime() - 1800000).toISOString(),
        isFromManager: false,
      },
    ],
  },
  {
    id: 'n3',
    title: '시스템 점검 안내',
    content: '오늘 오후 6시~7시 LMS 시스템 점검이 있습니다.',
    authorId: 'mgr1',
    authorName: '김운영',
    isGlobal: true,
    isRead: true,
    timestamp: new Date(today.getTime() - 86400000).toISOString(),
    replies: [],
  },
]

export const mockIssues: Issue[] = [
  {
    id: 'i1',
    title: '수강생 출결 시스템 오류',
    content: '오늘 오전 출석체크 시 일부 수강생 출석이 누락되었습니다. 확인 부탁드립니다.',
    urgency: 'urgent',
    status: 'answered',
    timestamp: new Date(today.getTime() - 5400000).toISOString(),
    replies: [
      {
        id: 'ir1',
        authorId: 'mgr1',
        authorName: '김운영',
        content: '확인했습니다. 수동으로 수정해두었습니다.',
        timestamp: new Date(today.getTime() - 3600000).toISOString(),
        isFromManager: true,
      },
    ],
  },
  {
    id: 'i2',
    title: '교육장 에어컨 고장',
    content: '3층 교육장 에어컨이 작동하지 않습니다.',
    urgency: 'normal',
    status: 'pending',
    timestamp: new Date(today.getTime() - 1800000).toISOString(),
    replies: [],
  },
]

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'ce1',
    title: '프로젝트 발표',
    date: addDays(today, 2),
    category: 'project',
  },
  {
    id: 'ce2',
    title: '과제 제출 마감',
    date: addDays(today, 1),
    category: 'assignment',
  },
  {
    id: 'ce3',
    title: '멘토링 세션',
    date: addDays(today, 3),
    category: 'general',
  },
  {
    id: 'ce4',
    title: '중간 평가',
    date: addDays(today, 4),
    category: 'evaluation',
  },
]

export const mockChapterEvents: CalendarEvent[] = [
  {
    id: 'ch1',
    title: '챕터 3 시작',
    date: addDays(today, -3),
    category: 'general',
  },
  {
    id: 'ch2',
    title: '과제 제출',
    date: addDays(today, 1),
    category: 'assignment',
  },
  {
    id: 'ch3',
    title: '프로젝트 시작',
    date: addDays(today, 5),
    category: 'project',
  },
  {
    id: 'ch4',
    title: '중간 평가',
    date: addDays(today, 10),
    category: 'evaluation',
  },
  {
    id: 'ch5',
    title: '발제',
    date: addDays(today, 7),
    category: 'general',
  },
  {
    id: 'ch6',
    title: '최종 평가',
    date: addDays(today, 14),
    category: 'evaluation',
  },
  {
    id: 'ch7',
    title: '챕터 3 종료',
    date: addDays(today, 14),
    category: 'general',
  },
]
