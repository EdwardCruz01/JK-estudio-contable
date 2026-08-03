import { appConfig } from "./config";

export const supabaseReady = Boolean(appConfig.supabase.url && appConfig.supabase.anonKey);
export const supabaseConfig = appConfig.supabase;

export async function login(email: string, password: string) {
  if (!supabaseReady) return { data: { user: { email, role: email.includes("admin") ? "admin" : "client" } }, error: null, mode: "local" as const };
  throw new Error("Conecta @supabase/supabase-js en la capa de infraestructura para habilitar autenticación remota.");
}

export async function register(payload: Record<string, unknown>) { return { data: payload, error: null, mode: "local" as const }; }
export async function listCompanies() { return { data: [], error: null, mode: "local" as const }; }
export async function saveCompany(payload: Record<string, unknown>) { return { data: payload, error: null, mode: "local" as const }; }
export async function listDocuments() { return { data: [], error: null, mode: "local" as const }; }
export async function saveDocument(payload: Record<string, unknown>) { return { data: payload, error: null, mode: "local" as const }; }
export async function deleteDocument(id: string) { return { data: { id }, error: null, mode: "local" as const }; }
export async function uploadFile(file: File, bucket = "documentos") { return { data: { bucket, name: file.name }, error: null, mode: "local" as const }; }

