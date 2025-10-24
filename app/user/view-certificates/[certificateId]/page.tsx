import VehicleCertificateComponent from "@/components/VehicleCertificateComponent";


export default async function Page({
  params,
}: {
  params: Promise<{ certificateId: string }>
}) {
  const { certificateId } = await params;
  return (
    <VehicleCertificateComponent tokenId={certificateId} />
  );
}