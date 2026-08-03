import { storage } from "./storage.js";
import { supabase } from "./supabase-client.js";

const adminEmail = "admin@estudiojk.com.pe";
const remoteSession = async (response) => {
  const authResponse = response?.session || response;
  if (!authResponse?.access_token || !authResponse.user) return { session: null, error: "Revise su correo para confirmar la cuenta antes de iniciar sesión." };
  const profile = await supabase.profile(authResponse.access_token, authResponse.user);
  const session = { id: authResponse.user.id, name: profile?.nombre || authResponse.user.user_metadata?.name || authResponse.user.email, email: authResponse.user.email, role: profile?.rol || "client", companyId: profile?.empresa_id || null, accessToken: authResponse.access_token, refreshToken: authResponse.refresh_token || null };
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
    if (normalized === adminEmail && password === "12345") { const session = { id: "admin-local", name: "JK — Administrador", email: adminEmail, role: "admin" }; storage.saveSession(session); return { session, error: null }; }
    const user = storage.users().find((item) => item.email === normalized && item.password === password);
    if (!user) return { session: null, error: "Correo o contraseña incorrectos." };
    const session = { id: user.id, name: user.name, email: user.email, role: "client", company: user.company }; storage.saveSession(session); return { session, error: null };
  },
  async register({ name, email, password, company }) {
    const normalized = email.trim().toLowerCase();
    if (supabase.configured) {
      try { return await remoteSession(await supabase.signUp({ name: name.trim(), email: normalized, password, company: company.trim() })); } catch (error) { return { session: null, error: error.message || "No se pudo crear la cuenta." }; }
    }
    const users = storage.users(); if (normalized === adminEmail || users.some((item) => item.email === normalized)) return { session: null, error: "Este correo ya está registrado." }; if (password.length < 6) return { session: null, error: "La contraseña debe tener al menos 6 caracteres." };
    const user = { id: `client-${Date.now()}`, name: name.trim(), email: normalized, password, company: company.trim(), role: "client" }; users.push(user); storage.saveUsers(users); const session = { id: user.id, name: user.name, email: user.email, company: user.company, role: "client" }; storage.saveSession(session); return { session, error: null };
  }
};
