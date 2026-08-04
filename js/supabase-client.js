const config = globalThis.JK_SUPABASE_CONFIG || {};
const baseUrl = String(config.url || "").replace(/\/$/, "");
const key = String(config.anonKey || "");
const jsonHeaders = (token, extra = {}) => ({ apikey: key, Authorization: `Bearer ${token || key}`, ...extra });
const configured = Boolean(baseUrl && key);

async function request(path, options = {}, token) {
  if (!configured) throw new Error("Supabase no está configurado.");
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: jsonHeaders(token, options.headers) });
  const type = response.headers.get("content-type") || "";
  const data = type.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) throw new Error(data?.msg || data?.message || data?.error_description || "No se pudo completar la operación en Supabase.");
  return data;
}

const companyFromRow = (row) => ({ id: row.id, name: row.nombre, legalName: row.razon_social, ruc: row.ruc, address: row.direccion, district: row.distrito || "", province: row.provincia || "", department: row.departamento || "", phone: row.telefono || "", email: row.correo || "", representative: row.representante || "", color: row.color_corporativo || "#b49141", active: row.estado, logoPath: row.logo_url, logoData: "" });
const documentFromRow = (row) => ({ id: row.id, type: row.tipo, title: row.titulo, companyId: row.empresa_id, companyName: row.empresas?.nombre || "Empresa", period: row.periodo || "", amount: Number(row.importe || 0), createdAt: row.created_at, payload: row.payload || {}, file: row.archivos || null });
const suffixFromFile = (file) => file?.type === "image/png" ? "png" : "jpg";
const noLogoPaths = new Set(["sin-logo", "__sin_logo__"]);
const isStoredLogoPath = (value) => { const source = String(value || "").trim(); return Boolean(source && !noLogoPaths.has(source) && !/^(data:image\/|https?:\/\/)/i.test(source)); };
const assertLogoFile = (file) => {
  if (!file) return;
  if (!["image/png", "image/jpeg"].includes(file.type)) throw new Error("El logo debe ser un archivo PNG o JPG.");
  if (file.size > 5 * 1024 * 1024) throw new Error("El logo no puede superar los 5 MB.");
};

async function signedUrl(path, token) {
  const source = String(path || "").trim();
  if (!source || noLogoPaths.has(source)) return "";
  if (/^(data:image\/|https?:\/\/)/i.test(source)) return source;
  const value = await request(`/storage/v1/object/sign/logos/${encodeURIComponent(source).replace(/%2F/g, "/")}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expiresIn: 3600 }) }, token);
  const signed = String(value?.signedURL || value?.signedUrl || "").trim();
  if (!signed) throw new Error("Supabase no devolvió un enlace firmado para el logo.");
  if (/^https?:\/\//i.test(signed)) return signed;
  return signed.startsWith("/storage/v1/") ? `${baseUrl}${signed}` : `${baseUrl}/storage/v1/${signed.replace(/^\/+/, "")}`;
}

export const supabase = {
  configured,
  async signIn(email, password) {
    return request("/auth/v1/token?grant_type=password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  },
  async signUp({ name, email, password, company }) {
    return request("/auth/v1/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, data: { name, company } }) });
  },
  async signOut(token) { if (configured && token) await request("/auth/v1/logout", { method: "POST" }, token); },
  async profile(token, user) {
    const rows = await request(`/rest/v1/usuarios?select=id,nombre,email,rol,empresa_id&id=eq.${encodeURIComponent(user.id)}&limit=1`, {}, token);
    return rows[0] || null;
  },
  async companies(token) {
    const rows = await request("/rest/v1/empresas?select=*&order=created_at.desc", {}, token);
    return Promise.all(rows.map(async (row) => {
      const company = companyFromRow(row);
      try { company.logoData = await signedUrl(row.logo_url, token); }
      catch (error) { company.logoError = error.message; }
      return company;
    }));
  },
  async logoUrl(path, token) { return signedUrl(path, token); },
  async documents(token) {
    const rows = await request("/rest/v1/documentos?select=*,empresas(nombre),archivos(id,bucket,storage_path,nombre)&order=created_at.desc", {}, token);
    return rows.map(documentFromRow);
  },
  async saveCompany(company, file, token) {
    let logoPath = company.logoPath || "";
    let uploadedPath = "";
    if (file) {
      assertLogoFile(file);
      logoPath = `${company.id}/logo-${Date.now()}.${suffixFromFile(file)}`;
      uploadedPath = logoPath;
      await request(`/storage/v1/object/logos/${logoPath}`, { method: "POST", headers: { "Content-Type": file.type, "x-upsert": "true" }, body: file }, token);
    }
    if (!logoPath) logoPath = "sin-logo";
    const body = { id: company.id, nombre: company.name, razon_social: company.legalName || company.name, ruc: company.ruc, direccion: company.address, distrito: company.district || null, provincia: company.province || null, departamento: company.department || null, telefono: company.phone || null, correo: company.email || null, representante: company.representative || null, logo_url: logoPath, color_corporativo: company.color, estado: company.active };
    let rows;
    try {
      rows = await request("/rest/v1/empresas?on_conflict=id", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify(body) }, token);
    } catch (error) {
      if (uploadedPath) await request(`/storage/v1/object/logos/${encodeURIComponent(uploadedPath).replace(/%2F/g, "/")}`, { method: "DELETE" }, token).catch(() => {});
      throw error;
    }
    if (!rows?.[0]) throw new Error("Supabase no devolvió la empresa guardada.");
    if (uploadedPath && isStoredLogoPath(company.logoPath) && company.logoPath !== uploadedPath) {
      await request(`/storage/v1/object/logos/${encodeURIComponent(company.logoPath).replace(/%2F/g, "/")}`, { method: "DELETE" }, token).catch(() => {});
    }
    return { ...companyFromRow(rows[0]), logoData: await signedUrl(rows[0].logo_url, token).catch(() => "") };
  },
  async deleteCompany(company, token) {
    const rows = await request(`/rest/v1/empresas?id=eq.${encodeURIComponent(company.id)}`, { method: "DELETE", headers: { Prefer: "return=representation" } }, token);
    if (!Array.isArray(rows) || rows.length === 0) throw new Error("No se encontró la empresa o no tiene permisos para eliminarla.");
    if (isStoredLogoPath(company.logoPath)) {
      await request(`/storage/v1/object/logos/${encodeURIComponent(company.logoPath).replace(/%2F/g, "/")}`, { method: "DELETE" }, token).catch(() => {});
    }
  },
  async saveDocument(document, blob, token, userId) {
    const storagePath = `${userId}/${crypto.randomUUID()}.pdf`;
    await request(`/storage/v1/object/documentos/${storagePath}`, { method: "POST", headers: { "Content-Type": "application/pdf", "x-upsert": "false" }, body: blob }, token);
    const [file] = await request("/rest/v1/archivos", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify({ usuario_id: userId, empresa_id: document.companyId, nombre: `${document.title}.pdf`, bucket: "documentos", storage_path: storagePath, mime_type: "application/pdf", size_bytes: blob.size }) }, token);
    const [saved] = await request("/rest/v1/documentos", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify({ usuario_id: userId, empresa_id: document.companyId, tipo: document.type, titulo: document.title, periodo: document.period || null, importe: document.amount, archivo_id: file.id, payload: document.payload }) }, token);
    if (document.type === "boleta") await request("/rest/v1/plantillas_generadas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documento_id: saved.id, datos_extraidos: document.payload.payroll || {} }) }, token);
    if (document.type === "honorarios") await request("/rest/v1/honorarios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documento_id: saved.id, fecha: document.payload.fee.date, saludo: document.payload.fee.greeting || null, observaciones: document.payload.fee.observations || null, conceptos: document.payload.fee.items, total: document.amount }) }, token);
    return { ...document, id: saved.id, file: { id: file.id, bucket: "documentos", storage_path: storagePath, nombre: file.nombre } };
  },
  async deleteDocument(document, token) {
    if (document.file?.storage_path) await request(`/storage/v1/object/documentos/${document.file.storage_path}`, { method: "DELETE" }, token).catch(() => {});
    await request(`/rest/v1/documentos?id=eq.${encodeURIComponent(document.id)}`, { method: "DELETE" }, token);
  }
};
