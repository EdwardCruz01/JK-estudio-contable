import { View } from "../lib/types";

const nav: { label: string; view: View; icon: string }[] = [
  { label: "Dashboard", view: "dashboard", icon: "▦" },
  { label: "Empresas", view: "companies", icon: "▥" },
  { label: "Historial de archivos", view: "history", icon: "◫" },
];

export function Sidebar({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark">JK</span><div><b>Estudio JK</b><small>PANEL ADMIN</small></div></div><div className="side-group"><span className="side-label">GESTIÓN</span>{nav.map((item) => <button key={item.view} className={`side-link ${view === item.view ? "active" : ""}`} onClick={() => onChange(item.view)}><span>{item.icon}</span>{item.label}</button>)}</div><div className="side-group automation"><span className="side-label">AUTOMATIZACIÓN</span><button className={`side-link ${view === "templates" ? "active" : ""}`} onClick={() => onChange("templates")}><span>↥</span>Generar plantillas</button><button className={`side-link ${view === "fees" ? "active" : ""}`} onClick={() => onChange("fees")}><span>▣</span>Generar honorarios</button></div><div className="sidebar-spacer"/><div className="side-user"><span className="avatar">J</span><div><b>JK — Administrador</b><small>admin@estudiojk.com.pe</small></div></div><button className="logout" onClick={() => window.alert("Sesión local cerrada")}>↪ <span>Cerrar sesión</span></button></aside>;
}

