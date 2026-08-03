export type UserRole = "admin" | "client";

export type AuthSession = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
};

type RegisteredUser = AuthSession & { password: string };

const sessionKey = "jk-auth-session";
const usersKey = "jk-auth-users";
const adminEmail = "admin@estudiojk.com.pe";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
}

export const auth = {
  getSession: () => read<AuthSession | null>(sessionKey, null),
  signOut: () => typeof window !== "undefined" && window.localStorage.removeItem(sessionKey),
  signIn(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === adminEmail && password === "12345") {
      const session: AuthSession = { id: "admin-local", name: "JK — Administrador", email: adminEmail, role: "admin" };
      write(sessionKey, session);
      return { session, error: null };
    }
    const user = read<RegisteredUser[]>(usersKey, []).find((item) => item.email === normalizedEmail && item.password === password);
    if (!user) return { session: null, error: "Correo o contraseña incorrectos." };
    const { password: _password, ...session } = user;
    write(sessionKey, session);
    return { session, error: null };
  },
  register(payload: { name: string; email: string; password: string; company: string }) {
    const users = read<RegisteredUser[]>(usersKey, []);
    const email = payload.email.trim().toLowerCase();
    if (email === adminEmail || users.some((item) => item.email === email)) return { session: null, error: "Este correo ya está registrado." };
    if (payload.password.length < 6) return { session: null, error: "La contraseña debe tener al menos 6 caracteres." };
    const session: AuthSession = { id: `client-${Date.now()}`, name: payload.name.trim(), email, role: "client", company: payload.company.trim() };
    users.push({ ...session, password: payload.password });
    write(usersKey, users);
    write(sessionKey, session);
    return { session, error: null };
  },
};
