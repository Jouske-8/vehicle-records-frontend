export interface UploadFilesResult {
  ipfsHash: string;
  url: string;
}

/**
 * Upload a FormData object to the server.
 * @param formData - The FormData containing files
 * @param endpoint - API endpoint URL (default: "/api/files")
 */
export async function uploadFilesToServer(
  formData: FormData,
  endpoint: string,
): Promise<UploadFilesResult> {
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`File upload failed: ${response.statusText}`);
  }

  return await response.json();
}
