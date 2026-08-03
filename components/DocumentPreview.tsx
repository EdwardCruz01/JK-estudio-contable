import { useEffect } from "react";
import { Company, GeneratedDocument, XmlPayroll } from "../lib/types";
import { renderDocumentHtml, renderFeeDocument, renderPayrollDocument, openPrintableDocument } from "../lib/document-renderer";

export function DocumentPreview({ company, document, payroll, fee, onClose }: { company: Company; document?: GeneratedDocument; payroll?: XmlPayroll; fee?: { date: string; greeting: string; observations: string; items: { id: string; description: string; amount: number }[] }; onClose: () => void }) {
  const html = document ? renderDocumentHtml(document, company) : payroll ? renderPayrollDocument(company, payroll) : renderFeeDocument(company, fee!);
  useEffect(() => { const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose(); window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [onClose]);
  return <div className="modal-backdrop preview-backdrop"><div className="preview-modal"><div className="preview-toolbar"><div><span className="eyebrow">VISTA PREVIA</span><h2>{document?.title ?? (payroll ? "Boleta de pago" : "Recibo por honorarios")}</h2></div><div className="preview-actions"><button className="secondary-button" onClick={() => openPrintableDocument(html, document?.title ?? "Documento JK")}>↓ Descargar PDF</button><button className="close-button" onClick={onClose}>×</button></div></div><div className="preview-scroll"><div dangerouslySetInnerHTML={{ __html: html }} /></div></div></div>;
}

