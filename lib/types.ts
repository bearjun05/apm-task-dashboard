export interface Message {
  id: string
  authorId: string
  authorName: string
  content: string
  timestamp: string
  isFromManager: boolean
}

export interface Task {
  id: string
  title: string
  dueDate: string
  dueTime?: string
  isCompleted: boolean
  isImportant: boolean
  type: 'system' | 'manager_request' | 'self_added' | 'period'
  startDate?: string
  endDate?: string
  chatMessages: Message[]
  detailContent?: string
  relatedIssueId?: string
}

export interface Notice {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  isGlobal: boolean
  isRead: boolean
  timestamp: string
  replies: Message[]
}

export interface Issue {
  id: string
  title: string
  content: string
  urgency: 'normal' | 'urgent'
  status: 'pending' | 'answered'
  timestamp: string
  relatedTaskId?: string
  replies: Message[]
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  category: 'assignment' | 'project' | 'evaluation' | 'general'
}
