import { StaffDetailPage } from '@/components/admin/staff-detail-page'

export default async function StaffPage({
  params,
}: {
  params: Promise<{ id: string; staffId: string }>
}) {
  const { id, staffId } = await params
  return <StaffDetailPage trackId={id} staffId={staffId} />
}
