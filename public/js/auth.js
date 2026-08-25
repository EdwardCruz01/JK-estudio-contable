import { storage } from "./storage.js";
import { supabase } from "./supabase-client.js";

const adminEmail = "admin@estudiojk.com.pe";
const remoteSession = async (response) => {
  const authResponse = response?.session || response;
  if (!authResponse?.access_token || !authResponse.user) return { session: null, error: "Revise su correo para confirmar la cuenta antes de iniciar sesión." };
  const profile = await supabase.profile(authResponse.access_token, authResponse.user);
  const birthDate = profile?.fecha_nacimiento || authResponse.user.user_metadata?.birthDate || authResponse.user.user_metadata?.fecha_nacimiento || "";
  const session = { id: authResponse.user.id, name: profile?.nombre || authResponse.user.user_metadata?.name || authResponse.user.email, email: authResponse.user.email, role: profile?.rol || "client", companyId: profile?.empresa_id || null, company: authResponse.user.user_metadata?.company || "", birthDate, accessToken: authResponse.access_token, refreshToken: authResponse.refresh_token || null };
  const directory = storage.users().filter((item) => item.id !== session.id && item.email !== session.email);
  directory.push({ id: session.id, name: session.name, email: session.email, company: session.company, birthDate, role: session.role });
  storage.saveUsers(directory);
  storage.saveSession(session); return { session, error: null };
};

export const auth = {
  getSession() { return storage.session(); },
  logout() { const session = storage.session(); storage.clearSession(); return supabase.signOut(session?.accessToken).catch(() => {}); },
  async login(email, password) {
    const normalized = email.trim().toLowerCase();
    if (supabase.configured) {
      try { return await remoteSession(await supabase.signIn(normalized, password)); } catch (error) { return { session: null, error: error.message || "No se pudo iniciar sesión." }; }
    }
    if (normalized === adminEmail && password === "12345") { const session = { id: "admin-local", name: "JK — Administrador", email: adminEmail, role: "admin", birthDate: "" }; storage.saveSession(session); return { session, error: null }; }
    const user = storage.users().find((item) => item.email === normalized && item.password === password);
    if (!user) return { session: null, error: "Correo o contraseña incorrectos." };
    const session = { id: user.id, name: user.name, email: user.email, role: "client", company: user.company, birthDate: user.birthDate || "" }; storage.saveSession(session); return { session, error: null };
  },
  async register({ name, email, password, company, birthDate }) {
    const normalized = email.trim().toLowerCase();
    if (supabase.configured) {
      try { return await remoteSession(await supabase.signUp({ name: name.trim(), email: normalized, password, company: company.trim(), birthDate })); } catch (error) { return { session: null, error: error.message || "No se pudo crear la cuenta." }; }
    }
    const users = storage.users(); if (normalized === adminEmail || users.some((item) => item.email === normalized)) return { session: null, error: "Este correo ya está registrado." }; if (password.length < 6) return { session: null, error: "La contraseña debe tener al menos 6 caracteres." };
    const user = { id: `client-${Date.now()}`, name: name.trim(), email: normalized, password, company: company.trim(), birthDate, role: "client" }; users.push(user); storage.saveUsers(users); const session = { id: user.id, name: user.name, email: user.email, company: user.company, birthDate, role: "client" }; storage.saveSession(session); return { session, error: null };
  }
};
