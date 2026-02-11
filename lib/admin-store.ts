import { create } from 'zustand'
import type {
  OperatorCard,
  TrackCard,
  StaffCard,
  StaffConversation,
  StaffIssue,
  StaffTask,
  StaffMessage,
  OperatorTask,
  OperatorTrackDetail,
  KanbanCard,
  KanbanStatus,
  ChatMessage,
  PlannerTrackCard,
} from './admin-mock-data'
import {
  mockOperators,
  mockTracks,
  mockStaffCards,
  mockStaffConversations,
  mockStaffIssues,
  mockStaffTasks,
  mockOperatorTasks,
  mockOperatorTrackDetails,
  mockKanbanCards,
  mockChatMessages,
  mockPlannerTracks,
} from './admin-mock-data'

interface AdminState {
  // Data
  operators: OperatorCard[]
  tracks: TrackCard[]
  staffCards: StaffCard[]
  staffConversations: StaffConversation[]
  staffIssues: StaffIssue[]
  staffTasks: StaffTask[]
  operatorTasks: Record<string, OperatorTask[]>
  operatorTrackDetails: Record<string, OperatorTrackDetail[]>
  userRole: 'operator_manager' | 'operator'

  // Kanban
  kanbanCards: KanbanCard[]
  chatMessages: ChatMessage[]
  plannerTracks: PlannerTrackCard[]

  // Kanban actions
  moveKanbanCard: (cardId: string, newStatus: KanbanStatus) => void
  updateKanbanCardStatus: (cardId: string, newStatus: KanbanStatus) => void
  addKanbanReply: (cardId: string, content: string) => void

  // Staff detail actions
  addConversationMessage: (convId: string, content: string) => void
  addIssueReply: (issueId: string, content: string, status?: StaffIssue['status'], assignee?: string) => void
  updateIssueStatus: (issueId: string, status: StaffIssue['status']) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  operators: mockOperators,
  tracks: mockTracks,
  staffCards: mockStaffCards,
  staffConversations: mockStaffConversations,
  staffIssues: mockStaffIssues,
  staffTasks: mockStaffTasks,
  operatorTasks: mockOperatorTasks,
  operatorTrackDetails: mockOperatorTrackDetails,
  userRole: 'operator_manager',

  kanbanCards: mockKanbanCards,
  chatMessages: mockChatMessages,
  plannerTracks: mockPlannerTracks,

  moveKanbanCard: (cardId, newStatus) =>
    set((state) => ({
      kanbanCards: state.kanbanCards.map((c) =>
        c.id === cardId ? { ...c, status: newStatus } : c,
      ),
    })),

  updateKanbanCardStatus: (cardId, newStatus) =>
    set((state) => ({
      kanbanCards: state.kanbanCards.map((c) =>
        c.id === cardId ? { ...c, status: newStatus } : c,
      ),
    })),

  addKanbanReply: (cardId, content) =>
    set((state) => ({
      kanbanCards: state.kanbanCards.map((c) =>
        c.id === cardId
          ? {
              ...c,
              status: c.status === 'waiting' ? 'in-progress' as KanbanStatus : c.status,
              messages: [
                ...c.messages,
                {
                  id: `kbr-${Date.now()}`,
                  authorName: '나',
                  content,
                  timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                  isSelf: true,
                } as StaffMessage,
              ],
            }
          : c,
      ),
    })),

  addConversationMessage: (convId, content) =>
    set((state) => ({
      staffConversations: state.staffConversations.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `msg-${Date.now()}`,
                  authorName: '이운영',
                  content,
                  timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                  isSelf: true,
                } as StaffMessage,
              ],
            }
          : c,
      ),
    })),

  addIssueReply: (issueId, content, status, assignee) =>
    set((state) => ({
      staffIssues: state.staffIssues.map((i) =>
        i.id === issueId
          ? {
              ...i,
              status: status ?? i.status,
              assignee: assignee ?? i.assignee,
              replies: [
                ...i.replies,
                {
                  id: `reply-${Date.now()}`,
                  authorName: '이운영',
                  content,
                  timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                  isSelf: true,
                },
              ],
            }
          : i,
      ),
    })),

  updateIssueStatus: (issueId, status) =>
    set((state) => ({
      staffIssues: state.staffIssues.map((i) =>
        i.id === issueId ? { ...i, status } : i,
      ),
    })),
}))
