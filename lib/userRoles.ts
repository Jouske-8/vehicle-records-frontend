import { createPublicClient, http, getContract } from 'viem'
import { sepolia } from 'viem/chains'
import VehicleRegistryJson from '@/abi/VehicleRegistry.json'
import { keccak256, stringToBytes } from 'viem'

// RPC client
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

// VehicleRegistry contract
const vehicleRegistryAddress = '0xc766710e32112df1Eb266C90F5D8aEd2e58784ea'
const vehicleRegistry = getContract({
  address: vehicleRegistryAddress,
  abi: VehicleRegistryJson.abi,
  client: publicClient,
})

// Roles as in Solidity
const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
const AUDITOR_ROLE = keccak256(stringToBytes('AUDITOR_ROLE'))
const DEALER_ROLE = keccak256(stringToBytes('DEALER_ROLE'))
const OWNER_ROLE = keccak256(stringToBytes('OWNER_ROLE'))

export async function getUserRoles(userAddress: `0x${string}`): Promise<{
  isAdmin: boolean;
  isAuditor: boolean;
  isDealer: boolean;
  isOwner: boolean;
}> {
  // VehicleRegistry checks
  const [isAdminVR, isAuditor, isDealer, isOwner] = await Promise.all([
    vehicleRegistry.read.hasRole([DEFAULT_ADMIN_ROLE, userAddress]) as Promise<boolean>,
    vehicleRegistry.read.hasRole([AUDITOR_ROLE, userAddress]) as Promise<boolean>,
    vehicleRegistry.read.hasRole([DEALER_ROLE, userAddress]) as Promise<boolean>,
    vehicleRegistry.read.hasRole([OWNER_ROLE, userAddress]) as Promise<boolean>,
  ])

  return {
    isAdmin: isAdminVR,
    isAuditor,
    isDealer,
    isOwner,
  }
}