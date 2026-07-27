import { auth } from "@/lib/firebase";

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://api.gameonsolution.in";

// Returns an Authorization header if a user is signed in, or {} if not.
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await auth.currentUser?.getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
