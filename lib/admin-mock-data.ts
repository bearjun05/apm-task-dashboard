// Admin Dashboard Mock Data

export interface OperatorTrackSummary {
  trackName: string
  staffAvgCompletion: number
  issueResolutionRate: number
}

export interface OperatorCard {
  id: string
  name: string
  displayName: string
  taskCompletionRate: number
  taskCompleted: number
  taskTotal: number
  tracks: OperatorTrackSummary[]
}

export interface TrackCard {
  id: string
  name: string
  staffAvgCompletion: number
  issueResolutionRate: number
  urgentIssues: number
  pendingRequests: number
  staffCount: number
  studentCount: number
  isOwned: boolean
}

export interface StaffCard {
  id: string
  name: string
  taskCompletionRate: number
  taskCompleted: number
  taskTotal: number
  unreadMessages: number
  missedRound?: string
  isWarning: boolean
}

export interface StaffConversation {
  id: string
  taskTitle: string
  time: string
  isCompleted: boolean
  newMessageCount: number
  preview: string
  messages: StaffMessage[]
}

export interface StaffMessage {
  id: string
  authorName: string
  content: string
  timestamp: string
  isSelf: boolean
}

export interface StaffIssue {
  id: string
  title: string
  content: string
  urgency: 'urgent' | 'normal'
  status: 'pending' | 'in-progress' | 'done'
  authorName: string
  createdAt: string
  assignee?: string
  replies: StaffMessage[]
}

export interface StaffTask {
  id: string
  title: string
  time: string
  isCompleted: boolean
  completedTime?: string
  conversationCount?: number
  deadlineMinutes?: number
}

// Operator Detail types
export interface OperatorTask {
  id: string
  title: string
  dueDate: string
  isCompleted: boolean
  completedAt?: string
}

export interface OperatorTrackStaff {
  id: string
  name: string
  taskCompletionRate: number
  taskCompleted: number
  taskTotal: number
  unreadMessages: number
  missedRound?: string
}

export interface OperatorTrackDetail {
  trackId: string
  trackName: string
  staff: OperatorTrackStaff[]
}

// -- Admin Dashboard Home Data --

export const mockOperators: OperatorCard[] = [
  {
    id: 'op1',
    name: '이운영',
    displayName: '운영매 A (이운영)',
    taskCompletionRate: 85,
    taskCompleted: 17,
    taskTotal: 20,
    tracks: [
      { trackName: 'AI 7기', staffAvgCompletion: 92, issueResolutionRate: 95 },
      { trackName: 'BE 5기', staffAvgCompletion: 88, issueResolutionRate: 90 },
    ],
  },
  {
    id: 'op2',
    name: '김운영',
    displayName: '운영매 B (김운영)',
    taskCompletionRate: 90,
    taskCompleted: 18,
    taskTotal: 20,
    tracks: [
      { trackName: 'AI 8기', staffAvgCompletion: 85, issueResolutionRate: 88 },
    ],
  },
]

export const mockTracks: TrackCard[] = [
  {
    id: 'track1',
    name: 'AI 트랙 7기',
    staffAvgCompletion: 92,
    issueResolutionRate: 95,
    urgentIssues: 2,
    pendingRequests: 5,
    staffCount: 3,
    studentCount: 70,
    isOwned: true,
  },
  {
    id: 'track2',
    name: 'BE 트랙 5기',
    staffAvgCompletion: 88,
    issueResolutionRate: 90,
    urgentIssues: 0,
    pendingRequests: 3,
    staffCount: 2,
    studentCount: 50,
    isOwned: false,
  },
]

// -- Operator Detail Data --

export const mockOperatorTasks: Record<string, OperatorTask[]> = {
  op1: [
    { id: 'ot1', title: 'AI 7기 중간 평가 기준 수립', dueDate: '2/10', isCompleted: true, completedAt: '2/9 17:00' },
    { id: 'ot2', title: '멘토 일정 조율', dueDate: '2/12', isCompleted: false },
    { id: 'ot3', title: '학관매 주간 미팅 준비', dueDate: '2/10', isCompleted: true, completedAt: '2/10 09:00' },
    { id: 'ot4', title: 'BE 5기 챕터2 커리큘럼 검토', dueDate: '2/11', isCompleted: false },
    { id: 'ot5', title: 'AI 7기 중간 평가 준비', dueDate: '2/10', isCompleted: false },
    { id: 'ot6', title: '수강생 출결 리포트 작성', dueDate: '2/9', isCompleted: true, completedAt: '2/9 16:30' },
    { id: 'ot7', title: '교육장 시설 점검 보고', dueDate: '2/8', isCompleted: true, completedAt: '2/8 18:00' },
    { id: 'ot8', title: '주간 운영 회의 참석', dueDate: '2/10', isCompleted: true, completedAt: '2/10 11:00' },
    { id: 'ot9', title: '학관매 평가 기준 초안 작성', dueDate: '2/7', isCompleted: true, completedAt: '2/7 15:00' },
    { id: 'ot10', title: '수강생 만족도 설문 취합', dueDate: '2/6', isCompleted: true, completedAt: '2/6 17:00' },
    { id: 'ot11', title: '팀 재편성 계획서 작성', dueDate: '2/6', isCompleted: true, completedAt: '2/6 14:00' },
    { id: 'ot12', title: 'AI 7기 OT 자료 준비', dueDate: '2/5', isCompleted: true, completedAt: '2/5 16:00' },
    { id: 'ot13', title: '긴급 이슈 대응 가이드 작성', dueDate: '2/5', isCompleted: true, completedAt: '2/5 11:00' },
    { id: 'ot14', title: 'BE 5기 멘토링 매칭', dueDate: '2/4', isCompleted: true, completedAt: '2/4 15:00' },
    { id: 'ot15', title: '교육 콘텐츠 업데이트', dueDate: '2/4', isCompleted: true, completedAt: '2/4 17:00' },
    { id: 'ot16', title: '학관매 온보딩 가이드 업데이트', dueDate: '2/3', isCompleted: true, completedAt: '2/3 16:00' },
    { id: 'ot17', title: '이전 기수 데이터 정리', dueDate: '2/3', isCompleted: true, completedAt: '2/3 14:00' },
    { id: 'ot18', title: '운영 매뉴얼 검토', dueDate: '2/2', isCompleted: true, completedAt: '2/2 17:00' },
    { id: 'ot19', title: '예산 정산 보고', dueDate: '2/2', isCompleted: true, completedAt: '2/2 15:00' },
    { id: 'ot20', title: '월간 운영 보고서 작성', dueDate: '2/1', isCompleted: true, completedAt: '2/1 18:00' },
  ],
  op2: [
    { id: 'ot21', title: 'AI 8기 OT 준비', dueDate: '2/15', isCompleted: false },
    { id: 'ot22', title: '학관매 면접 진행', dueDate: '2/12', isCompleted: true, completedAt: '2/12 15:00' },
    { id: 'ot23', title: 'AI 8기 커리큘럼 확정', dueDate: '2/10', isCompleted: true, completedAt: '2/10 14:00' },
  ],
}

export const mockOperatorTrackDetails: Record<string, OperatorTrackDetail[]> = {
  op1: [
    {
      trackId: 'track1',
      trackName: 'AI 트랙 7기',
      staff: [
        { id: 'staff1', name: '김학관', taskCompletionRate: 92, taskCompleted: 11, taskTotal: 12, unreadMessages: 2 },
        { id: 'staff2', name: '이학관', taskCompletionRate: 88, taskCompleted: 8, taskTotal: 10, unreadMessages: 0, missedRound: '오전 팀순회' },
        { id: 'staff3', name: '박학관', taskCompletionRate: 65, taskCompleted: 7, taskTotal: 10, unreadMessages: 3 },
      ],
    },
    {
      trackId: 'track2',
      trackName: 'BE 트랙 5기',
      staff: [
        { id: 'staff4', name: '정학관', taskCompletionRate: 90, taskCompleted: 9, taskTotal: 10, unreadMessages: 1 },
        { id: 'staff5', name: '한학관', taskCompletionRate: 85, taskCompleted: 8, taskTotal: 10, unreadMessages: 0 },
      ],
    },
  ],
  op2: [
    {
      trackId: 'track3',
      trackName: 'AI 트랙 8기',
      staff: [
        { id: 'staff6', name: '최학관', taskCompletionRate: 87, taskCompleted: 7, taskTotal: 8, unreadMessages: 1 },
        { id: 'staff7', name: '강학관', taskCompletionRate: 82, taskCompleted: 9, taskTotal: 11, unreadMessages: 0 },
      ],
    },
  ],
}

// -- Track Detail Dashboard Data --

export const mockStaffCards: StaffCard[] = [
  {
    id: 'staff1',
    name: '김학관',
    taskCompletionRate: 92,
    taskCompleted: 11,
    taskTotal: 12,
    unreadMessages: 2,
    isWarning: false,
  },
  {
    id: 'staff2',
    name: '이학관',
    taskCompletionRate: 88,
    taskCompleted: 8,
    taskTotal: 10,
    unreadMessages: 0,
    missedRound: '오전 팀순회',
    isWarning: false,
  },
  {
    id: 'staff3',
    name: '박학관',
    taskCompletionRate: 65,
    taskCompleted: 7,
    taskTotal: 10,
    unreadMessages: 3,
    isWarning: true,
  },
]

// -- Staff Detail Page Data --

export const mockStaffConversations: StaffConversation[] = [
  {
    id: 'conv1',
    taskTitle: '오전 팀순회',
    time: '10:00',
    isCompleted: true,
    newMessageCount: 2,
    preview: '1팀 김철수 학생 추가 상담 필요',
    messages: [
      {
        id: 'cm1',
        authorName: '김학관',
        content: '1팀 김철수 학생이 진로 고민 중입니다. 추가 상담이 필요해 보입니다.',
        timestamp: '10:30',
        isSelf: false,
      },
      {
        id: 'cm2',
        authorName: '이운영',
        content: '멘토와 연결해드릴게요. 내일 오전에 면담 일정 잡겠습니다.',
        timestamp: '10:45',
        isSelf: true,
      },
    ],
  },
  {
    id: 'conv2',
    taskTitle: '오후 팀순회',
    time: '14:00',
    isCompleted: false,
    newMessageCount: 1,
    preview: '진도 체크 완료했습니다',
    messages: [
      {
        id: 'cm3',
        authorName: '김학관',
        content: '6팀~10팀 진도 체크 완료했습니다. 특이사항 없습니다.',
        timestamp: '14:30',
        isSelf: false,
      },
    ],
  },
]

export const mockStaffIssues: StaffIssue[] = [
  {
    id: 'si1',
    title: '교육장 에어컨 고장',
    content: '2번 교실 에어컨이 작동하지 않습니다.\n오늘 오후 수업 진행이 어려울 것 같습니다.',
    urgency: 'urgent',
    status: 'pending',
    authorName: '김학관',
    createdAt: '2026-02-10 08:30',
    replies: [],
  },
  {
    id: 'si2',
    title: '교육 자료 요청',
    content: '다음 주 특강에 필요한 교육 자료를 미리 받을 수 있을까요?',
    urgency: 'normal',
    status: 'pending',
    authorName: '이학관',
    createdAt: '2026-02-10 05:00',
    replies: [],
  },
]

export const mockStaffTasks: StaffTask[] = [
  {
    id: 'st1',
    title: '출석 체크',
    time: '09:00',
    isCompleted: true,
    completedTime: '09:25',
  },
  {
    id: 'st2',
    title: '오전 팀순회',
    time: '10:00',
    isCompleted: true,
    completedTime: '10:45',
    conversationCount: 2,
  },
  {
    id: 'st3',
    title: '오후 팀순회',
    time: '14:00',
    isCompleted: false,
    deadlineMinutes: 60,
  },
]
