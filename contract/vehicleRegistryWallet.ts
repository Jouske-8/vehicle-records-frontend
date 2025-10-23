"use client";

import { getPublicClient } from "@/utils/publicClient";
import { getWalletClient } from "@/utils/walletClient";
import VehicleRegistryJson from "@/abi/VehicleRegistry.json";

export const handleVehicleRegistration = async (ipfsHash: string) => {
    try {
        const { walletClient, account } = await getWalletClient();
        const publicClient = getPublicClient();
        if (!publicClient || !account) {
            throw new Error("Public client or account not available");
        }
        const { request } = await publicClient.simulateContract({
            account: account,
            address: "0xc766710e32112df1Eb266C90F5D8aEd2e58784ea",
            abi: VehicleRegistryJson.abi,
            functionName: "requestVehicleRegistration",
            args: [ipfsHash, account],
        });
        const hash = await walletClient.writeContract(request);
        console.log("Transaction hash:", hash);
    } catch (error) {
        console.error("Error registering vehicle:", error);
    }
};

export const approveVehicleRegistration = async (requestId: string, certificateIpfsHash: string) => {
    try {
        const { walletClient, account } = await getWalletClient();
        const publicClient = getPublicClient();
        if (!publicClient || !account) {
            throw new Error("Public client or account not available");
        }
        const { request } = await publicClient.simulateContract({
            account: account,
            address: "0xc766710e32112df1Eb266C90F5D8aEd2e58784ea",
            abi: VehicleRegistryJson.abi,
            functionName: "approveVehicleRegistration",
            args: [requestId, certificateIpfsHash],
        });
        const hash = await walletClient.writeContract(request);
        console.log("Transaction hash:", hash);
        return hash; // optionally return the hash
    } catch (error) {
        console.error("Error approving vehicle registration:", error);
        throw error; // optionally re-throw to handle upstream
    }
};

export const rejectVehicleRegistration = async (requestId: string, denyReason: string) => {
    try {
        const { walletClient, account } = await getWalletClient();
        const publicClient = getPublicClient();
        if (!publicClient || !account) {
            throw new Error("Public client or account not available");
        }
        const { request } = await publicClient.simulateContract({
            account: account,
            address: "0xc766710e32112df1Eb266C90F5D8aEd2e58784ea",
            abi: VehicleRegistryJson.abi,
            functionName: "denyVehicleRegistration",
            args: [requestId, denyReason],
        });
        const hash = await walletClient.writeContract(request);
        console.log("Transaction hash:", hash);
        return hash; // optionally return the hash
    } catch (error) {
        console.error("Error rejecting vehicle registration:", error);
        throw error; // optionally re-throw to handle upstream
    }
}
