"use client";

import { getPublicClient } from "@/utils/publicClient";
import { getWalletClient } from "@/utils/walletClient";
import VehicleRegistryJson from "@/abi/VehicleRegistry.json";
import RoleRequestJsonManager from "@/abi/RoleRequestManager.json";
import { keccak256, toBytes } from "viem";

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

export const fetchVehicleCertificate = async (tokenId: string) => {
    try {
        const { account } = await getWalletClient();
        const publicClient = getPublicClient();
        if (!publicClient || !account) {
            throw new Error("Public client or account not available");
        }
        const data = await publicClient.readContract({
            address: "0xc766710e32112df1Eb266C90F5D8aEd2e58784ea",
            account: account,
            abi: VehicleRegistryJson.abi,
            functionName: "fetchVehicleCertificate",
            args: [tokenId],
        })
        return data;
    } catch (error) {
        console.error("Error rejecting vehicle registration:", error);
        throw error; // optionally re-throw to handle upstream
    }
}


export const requestRole = async (role: string) => {
  try {
    const { walletClient, account } = await getWalletClient();
    const publicClient = getPublicClient();

    if (!publicClient || !account) {
      throw new Error("Public client or account not available");
    }

    // Convert string → bytes32 (same as Solidity keccak256("DEALER_ROLE"))
    const roleHash = keccak256(toBytes(role));

    const { request } = await publicClient.simulateContract({
      account,
      address: "0xc5F4DE9938a519489e51D1d2a9B64610244901a3",
      abi: RoleRequestJsonManager.abi,
      functionName: "requestRole",
      args: [roleHash],
    });

    const hash = await walletClient.writeContract(request);
    console.log("Transaction hash:", hash);
  } catch (error) {
    console.error("Error requesting role:", error);
    throw error;
  }
};

export const approveRoleRequest = async (requestId: string) => {
    try {
        const { walletClient, account } = await getWalletClient();
        const publicClient = getPublicClient();
        if (!publicClient || !account) {
            throw new Error("Public client or account not available");
        }
        const { request } = await publicClient.simulateContract({
            account: account,
            address: "0xc5F4DE9938a519489e51D1d2a9B64610244901a3",
            abi: RoleRequestJsonManager.abi,
            functionName: "approveRoleRequest",
            args: [requestId],
        });
        const hash = await walletClient.writeContract(request);
        console.log("Transaction hash:", hash);
    } catch (error) {
        console.error("Error approving role request:", error);
        throw error;
    }
}

export const denyRoleRequest = async (requestId: string) => {
    try {
        const { walletClient, account } = await getWalletClient();
        const publicClient = getPublicClient();
        if (!publicClient || !account) {
            throw new Error("Public client or account not available");
        }
        const { request } = await publicClient.simulateContract({
            account: account,
            address: "0xc5F4DE9938a519489e51D1d2a9B64610244901a3",
            abi: RoleRequestJsonManager.abi,
            functionName: "denyRoleRequest",
            args: [requestId],
        });
        const hash = await walletClient.writeContract(request);
        console.log("Transaction hash:", hash);
    } catch (error) {
        console.error("Error denying role request:", error);
        throw error;
    }
}