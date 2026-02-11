import { OperatorDetailPage } from '@/components/admin/operator-detail-page'

export default async function OperatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OperatorDetailPage operatorId={id} />
}
