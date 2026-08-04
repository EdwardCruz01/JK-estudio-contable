const keys = { companies: "jk-companies", documents: "jk-documents", users: "jk-auth-users", session: "jk-auth-session" };

function read(key, fallback) { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } }
function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.warn(`No se pudo guardar ${key} en este navegador:`, error.message); } }
const cachedCompanies = (companies) => Array.isArray(companies) ? companies.map((company) => ({ ...company, logoData: /^data:image\//i.test(String(company.logoData || "")) ? company.logoData : "" })) : companies;

export const storage = {
  companies(fallback) { return read(keys.companies, fallback); },
  saveCompanies(value) { write(keys.companies, cachedCompanies(value)); },
  documents(fallback) { return read(keys.documents, fallback); },
  saveDocuments(value) { write(keys.documents, value); },
  users(fallback = []) { return read(keys.users, fallback); },
  saveUsers(value) { write(keys.users, value); },
  session() { return read(keys.session, null); },
  saveSession(value) { write(keys.session, value); },
  clearSession() { localStorage.removeItem(keys.session); },
};
