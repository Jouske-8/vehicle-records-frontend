"use client";

import { VehicleCertificate } from "@/contract/vehicleRegistryServer";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";

export default function CertificateView({ certificates, pageSize }: { certificates: VehicleCertificate[]; pageSize: number; }) {
    const { address } = useAccount(); 
    const searchParams = useSearchParams();
    const page = searchParams.get("page") ? parseInt(searchParams.get("page") as string, 10) : 1;
    console.log("Current Page:", page);
    console.log("Page Size:", pageSize);
    const myCertificates = certificates.filter(cert => cert.owner.toLowerCase() === address?.toLowerCase());
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCertificates = myCertificates.slice(startIndex, endIndex);
    return (
        <div>
            {paginatedCertificates.map(cert => (
                <div key={cert.requestId.toString()}>
                    <h2>Certificate for Token ID: {cert.tokenId.toString()}</h2>
                    <p>Request ID: {cert.requestId.toString()}</p>
                    <p>Owner: {cert.owner}</p>
                    <p>IPFS Hash: {cert.certIpfsHash}</p>
                    <p>IPFS Url: <a href={`https://ipfs.io/ipfs/${cert.certIpfsHash}`} target="_blank" rel="noopener noreferrer">View Certificate</a></p>
                </div>
            ))}
        </div>
    );
}