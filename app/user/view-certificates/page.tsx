import { fetchVehicleCertificates } from "@/contract/vehicleRegistryServer";
import CertificateView from "@/components/CertificateView";

export default async function Page() {
    const certificates = await fetchVehicleCertificates();
    return <CertificateView certificates={certificates} />;
}