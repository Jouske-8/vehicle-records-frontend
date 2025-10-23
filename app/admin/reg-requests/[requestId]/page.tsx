import RegReqView from "@/components/RegReqView";

export default async function Page({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  return (
    <div>
      <RegReqView requestId={requestId} />
    </div>
  )
}
