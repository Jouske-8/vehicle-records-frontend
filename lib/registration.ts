export interface VehicleRequest {
  requestId: bigint;
  requester: string;
  owner: string;
  regIpfsHash: string;
}

/**
 * Fetch VehicleRegistrationRequested events for a given account
 */
export async function fetchVehicleRequests(): Promise<VehicleRequest[]> {
  const response = await fetch("http://localhost:4000/api/vehicle-events/requested");
  const data = await response.json();
  return data;
}
