import VehicleRequest from "@/components/VehicleRequest"

export default async function Page({
  params,
}: {
  params: Promise<{ requestId: string }>
}) {
  const { requestId } = await params;
  return (
    <VehicleRequest requestId={requestId} />
  );
}