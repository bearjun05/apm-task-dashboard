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
  ChatRoom,
  ChatBubbleData,
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
  mockChatRooms,
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
  chatRooms: ChatRoom[]
  plannerTracks: PlannerTrackCard[]

  // Kanban actions
  moveKanbanCard: (cardId: string, newStatus: KanbanStatus) => void
  updateKanbanCardStatus: (cardId: string, newStatus: KanbanStatus) => void
  addKanbanReply: (cardId: string, content: string) => void

  // Chat actions
  addChatMessage: (roomId: string, content: string, relatedKanbanId?: string) => void
  getKanbanLinkedMessages: (kanbanId: string) => ChatBubbleData[]

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
  chatRooms: mockChatRooms,
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

  addKanbanReply: (cardId, content) => {
    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })

    set((state) => {
      // Find the kanban card to know which operator it belongs to
      const card = state.kanbanCards.find((c) => c.id === cardId)

      // 1. Add message to kanban card
      const newKanbanCards = state.kanbanCards.map((c) =>
        c.id === cardId
          ? {
              ...c,
              status: c.status === 'waiting' ? ('in-progress' as KanbanStatus) : c.status,
              messages: [
                ...c.messages,
                { id: `kbr-${Date.now()}`, authorName: '나', content, timestamp: now, isSelf: true } as StaffMessage,
              ],
            }
          : c,
      )

      // 2. Also sync into the matching operator's chat room
      let newChatRooms = state.chatRooms
      if (card) {
        const matchRoom = state.chatRooms.find((r) => r.operatorName === card.operatorName)
        if (matchRoom) {
          newChatRooms = state.chatRooms.map((r) =>
            r.id === matchRoom.id
              ? {
                  ...r,
                  lastMessage: content,
                  lastTime: now,
                  messages: [
                    ...r.messages,
                    {
                      id: `kbr-chat-${Date.now()}`,
                      isSelf: true,
                      authorName: '나',
                      message: content,
                      time: now,
                      relatedKanbanId: cardId,
                      taskTitle: card.title,
                    } as ChatBubbleData,
                  ],
                }
              : r,
          )
        }
      }

      return { kanbanCards: newKanbanCards, chatRooms: newChatRooms }
    })
  },

  addChatMessage: (roomId, content, relatedKanbanId) => {
    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
    const newBubble: ChatBubbleData = {
      id: `cm-${Date.now()}`,
      isSelf: true,
      authorName: '나',
      message: content,
      time: now,
      relatedKanbanId,
    }

    set((state) => {
      // 1. Add message to chat room
      const newChatRooms = state.chatRooms.map((r) =>
        r.id === roomId
          ? { ...r, lastMessage: content, lastTime: now, unreadCount: 0, messages: [...r.messages, newBubble] }
          : r,
      )

      // 2. If tagged to a kanban card, also sync to that card's messages
      let newKanbanCards = state.kanbanCards
      if (relatedKanbanId) {
        newKanbanCards = state.kanbanCards.map((c) =>
          c.id === relatedKanbanId
            ? {
                ...c,
                status: c.status === 'waiting' ? ('in-progress' as KanbanStatus) : c.status,
                messages: [
                  ...c.messages,
                  { id: newBubble.id, authorName: '나', content, timestamp: now, isSelf: true } as StaffMessage,
                ],
              }
            : c,
        )
      }

      return { chatRooms: newChatRooms, kanbanCards: newKanbanCards }
    })
  },

  getKanbanLinkedMessages: (kanbanId) => {
    const state = useAdminStore.getState()
    const linked: ChatBubbleData[] = []
    for (const room of state.chatRooms) {
      for (const msg of room.messages) {
        if (msg.relatedKanbanId === kanbanId) {
          linked.push(msg)
        }
      }
    }
    return linked
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
