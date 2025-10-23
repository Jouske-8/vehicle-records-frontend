import { getPublicClient } from "@/utils/publicClient";
import { getWalletClient } from "@/utils/walletClient";
import vehicleRegistryJson from "@/abi/VehicleRegistry.json";

/** Enum matching the contract's VehicleStatus */
export enum VehicleStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

/** TypeScript interface for the full vehicle registration */
export interface VehicleRegistration {
  ownerAddress: string;
  requesterAddress: string;
  registrationDate: bigint;
  issuerAddress: string;
  status: VehicleStatus;
  regIpfsHash: string;
  minted: boolean;
}

/**
 * Fetch the full vehicle registration by requestId
 */
export const fetchVehicleRequestFull = async (
  requestId: string
): Promise<VehicleRegistration | null> => {
  try {
    const publicClient = getPublicClient();
    const { account } = await getWalletClient();
    if (!publicClient || !account) {
      throw new Error("Public client or account not available");
    }
    const data = await publicClient.readContract({
      account: account,
      address: "0xc766710e32112df1Eb266C90F5D8aEd2e58784ea",
      abi: vehicleRegistryJson.abi,
      functionName: "fetchVehicleRegistrationRequest",
      args: [requestId],
    });

    // Map raw status number to enum
    return {
      ownerAddress: data.ownerAddress,
      requesterAddress: data.requesterAddress,
      registrationDate: BigInt(data.registrationDate),
      issuerAddress: data.issuerAddress,
      status: data.status in VehicleStatus ? data.status : VehicleStatus.Pending,
      regIpfsHash: data.regIpfsHash,
      minted: data.minted,
    };
  } catch (err) {
    console.error("Error fetching vehicle registration:", err);
    return null;
  }
};
