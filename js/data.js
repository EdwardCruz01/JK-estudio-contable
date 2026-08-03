export const sampleCompanies = [
  { id: "company-1", name: "CORPORACIÓN CHÁVEZ E.I.R.L.", legalName: "CORPORACIÓN CHÁVEZ E.I.R.L.", ruc: "20489725437", address: "Jr. Chile 00011", district: "Amarilis", province: "Huánuco", department: "Huánuco", phone: "950 361 967", email: "contacto@chavez.pe", representative: "Ronald Chávez", color: "#a77b25", active: true, createdAt: "2026-01-10" },
  { id: "company-2", name: "INVERSIONES ANDINAS S.A.C.", legalName: "INVERSIONES ANDINAS S.A.C.", ruc: "20512345678", address: "Av. Los Andes 450", district: "San Isidro", province: "Lima", department: "Lima", phone: "987 654 321", email: "gerencia@andinas.pe", representative: "María Torres", color: "#253047", active: true, createdAt: "2026-02-14" },
  { id: "company-3", name: "SERVICIOS INTEGRALES PACÍFICO S.R.L.", legalName: "SERVICIOS INTEGRALES PACÍFICO S.R.L.", ruc: "20609988776", address: "Av. Pacífico 880", district: "Miraflores", province: "Lima", department: "Lima", phone: "955 444 333", email: "info@pacifico.pe", representative: "Luis Fernández", color: "#8d3617", active: false, createdAt: "2026-03-02" },
];

export const sampleDocuments = [
  { id: "doc-1", type: "boleta", title: "Boleta de pago · 06/2026", companyId: "company-1", companyName: "CORPORACIÓN CHÁVEZ E.I.R.L.", period: "06/2026", amount: 1306.2, createdAt: new Date().toISOString(), payload: {} },
  { id: "doc-2", type: "honorarios", title: "Honorarios · Pagos servicios contables", companyId: "company-2", companyName: "INVERSIONES ANDINAS S.A.C.", amount: 1000, createdAt: new Date(Date.now() - 17 * 86400000).toISOString(), payload: {} },
];
