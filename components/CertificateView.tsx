"use client";

import { VehicleCertificate } from "@/contract/vehicleRegistryServer";
import { useAccount } from "wagmi";
export default function CertificateView({ certificates }: { certificates: VehicleCertificate[] }) {
    const { address } = useAccount(); 
    const myCertificates = certificates.filter(cert => cert.owner.toLowerCase() === address?.toLowerCase());   
    return (
        <div>
            {myCertificates.map(cert => (
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