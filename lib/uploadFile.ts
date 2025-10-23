export interface UploadFilesResult {
  ipfsHash: string;
  url: string;
}
/**
 * Upload one or more files to a specified endpoint.
 * @param files - Record of file key -> File object
 * @param endpoint - API endpoint URL (default: "/api/files")
 */
export async function uploadFilesToServer(
  files: Record<string, File>,
  endpoint: string,
): Promise<UploadFilesResult> {
  const formData = new FormData();
  for (const [key, file] of Object.entries(files)) {
    formData.append(key, file);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`File upload failed: ${response.statusText}`);
  }

  return await response.json();
}
