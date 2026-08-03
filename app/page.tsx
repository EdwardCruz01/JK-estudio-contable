"use client";

import { useEffect, useState } from "react";
import { Companies } from "../components/Companies";
import { Dashboard } from "../components/Dashboard";
import { History } from "../components/History";
import { HonorariosGenerator } from "../components/HonorariosGenerator";
import { Sidebar } from "../components/Sidebar";
import { TemplateGenerator } from "../components/TemplateGenerator";
import { Topbar } from "../components/Topbar";
import { sampleCompanies, sampleDocuments } from "../lib/sample-data";
import { storage } from "../lib/storage";
import { Company, GeneratedDocument, View } from "../lib/types";

export default function Home() {
  const [view, setView] = useState<View>("dashboard"); const [menuOpen, setMenuOpen] = useState(false); const [companies, setCompanies] = useState<Company[]>(sampleCompanies); const [documents, setDocuments] = useState<GeneratedDocument[]>(sampleDocuments);
  useEffect(() => { setCompanies(storage.getCompanies(sampleCompanies)); setDocuments(storage.getDocuments(sampleDocuments)); }, []);
  const changeCompanies = (next: Company[]) => { setCompanies(next); storage.saveCompanies(next); };
  const saveCompany = (company: Company) => changeCompanies([...companies.filter((item) => item.id !== company.id), company]);
  const deleteCompany = (id: string) => { if (window.confirm("¿Eliminar esta empresa? Los documentos existentes se conservarán.")) changeCompanies(companies.filter((item) => item.id !== id)); };
  const addDocument = (document: GeneratedDocument) => { const next = [document, ...documents]; setDocuments(next); storage.saveDocuments(next); };
  const deleteDocument = (id: string) => { if (window.confirm("¿Eliminar este archivo del historial?")) { const next = documents.filter((item) => item.id !== id); setDocuments(next); storage.saveDocuments(next); } };
  const content = view === "dashboard" ? <Dashboard companies={companies} documents={documents} onNavigate={setView} /> : view === "companies" ? <Companies companies={companies} onSave={saveCompany} onDelete={deleteCompany} /> : view === "templates" ? <TemplateGenerator companies={companies} onGenerated={addDocument} /> : view === "fees" ? <HonorariosGenerator companies={companies} onGenerated={addDocument} /> : <History documents={documents} companies={companies} onDelete={deleteDocument} />;
  return <div className="app-shell"><Sidebar view={view} onChange={(next) => { setView(next); setMenuOpen(false); }} /><div className={`main-shell ${menuOpen ? "menu-open" : ""}`}><Topbar onMenu={() => setMenuOpen(!menuOpen)} /><main>{content}</main></div></div>;
}

