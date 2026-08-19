const cache = new Map<
  string,
  { fileName: string; mimeType: string; byteSize: number; base64: string }
>();

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function rememberCaseFile(
  caseId: string,
  payload: { fileName: string; mimeType: string; byteSize: number; base64: string },
) {
  cache.set(caseId, payload);
}

export function getCaseFile(caseId: string) {
  return cache.get(caseId) ?? null;
}

export const MAX_ANALYZE_BYTES = 4 * 1024 * 1024;
