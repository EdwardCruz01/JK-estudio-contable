import { storage } from "./storage.js";

const adminEmail = "admin@estudiojk.com.pe";

export const auth = {
  getSession() { return storage.session(); },
  logout() { storage.clearSession(); },
  login(email, password) {
    const normalized = email.trim().toLowerCase();
    if (normalized === adminEmail && password === "12345") {
      const session = { id: "admin-local", name: "JK — Administrador", email: adminEmail, role: "admin" };
      storage.saveSession(session); return { session, error: null };
    }
    const user = storage.users().find((item) => item.email === normalized && item.password === password);
    if (!user) return { session: null, error: "Correo o contraseña incorrectos." };
    const session = { id: user.id, name: user.name, email: user.email, role: "client", company: user.company };
    storage.saveSession(session); return { session, error: null };
  },
  register({ name, email, password, company }) {
    const normalized = email.trim().toLowerCase(); const users = storage.users();
    if (normalized === adminEmail || users.some((item) => item.email === normalized)) return { session: null, error: "Este correo ya está registrado." };
    if (password.length < 6) return { session: null, error: "La contraseña debe tener al menos 6 caracteres." };
    const user = { id: `client-${Date.now()}`, name: name.trim(), email: normalized, password, company: company.trim(), role: "client" };
    users.push(user); storage.saveUsers(users); const session = { id: user.id, name: user.name, email: user.email, company: user.company, role: "client" }; storage.saveSession(session);
    return { session, error: null };
  },
};
