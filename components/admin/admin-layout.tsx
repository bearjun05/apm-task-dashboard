'use client'

import { useAdminStore } from '@/lib/admin-store'
import { AdminDashboardHome } from './admin-dashboard-home'
import { TrackDetailDashboard } from './track-detail-dashboard'
import { StaffDetailPage } from './staff-detail-page'

export function AdminLayout() {
  const { currentView } = useAdminStore()

  switch (currentView) {
    case 'home':
      return <AdminDashboardHome />
    case 'track-detail':
      return <TrackDetailDashboard />
    case 'staff-detail':
      return <StaffDetailPage />
    default:
      return <AdminDashboardHome />
  }
}
