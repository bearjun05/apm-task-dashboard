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
} from './admin-mock-data'

export type AdminView = 'home' | 'operator-detail' | 'track-detail' | 'staff-detail'

interface AdminState {
  // Navigation
  currentView: AdminView
  selectedTrackId: string | null
  selectedStaffId: string | null
  selectedOperatorId: string | null
  userRole: 'operator_manager' | 'operator'

  // Data
  operators: OperatorCard[]
  tracks: TrackCard[]
  staffCards: StaffCard[]
  staffConversations: StaffConversation[]
  staffIssues: StaffIssue[]
  staffTasks: StaffTask[]
  operatorTasks: Record<string, OperatorTask[]>
  operatorTrackDetails: Record<string, OperatorTrackDetail[]>

  // Actions
  navigateTo: (view: AdminView, params?: { trackId?: string; staffId?: string; operatorId?: string }) => void
  goBack: () => void

  // Staff detail actions
  addConversationMessage: (convId: string, content: string) => void
  addIssueReply: (issueId: string, content: string, status?: StaffIssue['status'], assignee?: string) => void
  updateIssueStatus: (issueId: string, status: StaffIssue['status']) => void
}

export const useAdminStore = create<AdminState>((set, get) => ({
  currentView: 'home',
  selectedTrackId: null,
  selectedStaffId: null,
  selectedOperatorId: null,
  userRole: 'operator_manager',

  operators: mockOperators,
  tracks: mockTracks,
  staffCards: mockStaffCards,
  staffConversations: mockStaffConversations,
  staffIssues: mockStaffIssues,
  staffTasks: mockStaffTasks,
  operatorTasks: mockOperatorTasks,
  operatorTrackDetails: mockOperatorTrackDetails,

  navigateTo: (view, params) =>
    set({
      currentView: view,
      selectedTrackId: params?.trackId ?? get().selectedTrackId,
      selectedStaffId: params?.staffId ?? get().selectedStaffId,
      selectedOperatorId: params?.operatorId ?? get().selectedOperatorId,
    }),

  goBack: () => {
    const { currentView } = get()
    if (currentView === 'staff-detail') {
      set({ currentView: 'track-detail', selectedStaffId: null })
    } else if (currentView === 'track-detail') {
      set({ currentView: 'home', selectedTrackId: null })
    } else if (currentView === 'operator-detail') {
      set({ currentView: 'home', selectedOperatorId: null })
    }
  },

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
