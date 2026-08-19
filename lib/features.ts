/**
 * Client-safe feature flags. Gemini's API key stays on the server;
 * enable the client path with NEXT_PUBLIC_AI_PROVIDER=gemini.
 */
export type DataSource = "mock" | "firebase";
export type AiProvider = "mock" | "gemini";

export function getDataSource(): DataSource {
  return process.env.NEXT_PUBLIC_DATA_SOURCE === "firebase" ? "firebase" : "mock";
}

export function getAiProvider(): AiProvider {
  return process.env.NEXT_PUBLIC_AI_PROVIDER === "gemini" ? "gemini" : "mock";
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  );
}

export function firebaseReady(): boolean {
  return getDataSource() === "firebase" && isFirebaseConfigured();
}

export function geminiReady(): boolean {
  return getAiProvider() === "gemini";
}
