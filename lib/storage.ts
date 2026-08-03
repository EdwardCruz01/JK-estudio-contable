import { Company, GeneratedDocument } from "./types";

const keys = { companies: "jk-companies", documents: "jk-documents" };

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

export const storage = {
  getCompanies: (fallback: Company[]) => read(keys.companies, fallback),
  saveCompanies: (value: Company[]) => write(keys.companies, value),
  getDocuments: (fallback: GeneratedDocument[]) => read(keys.documents, fallback),
  saveDocuments: (value: GeneratedDocument[]) => write(keys.documents, value),
};

