import { PayrollItem, XmlPayroll } from "./types";

const cells = (row: Element) => Array.from(row.getElementsByTagNameNS("urn:schemas-microsoft-com:office:spreadsheet", "Cell")).map((cell) => {
  const data = cell.getElementsByTagNameNS("urn:schemas-microsoft-com:office:spreadsheet", "Data")[0];
  return data?.textContent?.trim() ?? "";
});

const money = (value: string) => Number(value.replace(/,/g, "").replace("S/", "").trim()) || 0;

export function parseSunatXml(source: string): XmlPayroll {
  const doc = new DOMParser().parseFromString(source, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("El XML no tiene un formato válido.");
  const rows = Array.from(doc.getElementsByTagNameNS("urn:schemas-microsoft-com:office:spreadsheet", "Row"));
  const values = rows.map(cells);
  const find = (label: string) => values.find((row) => row.some((item) => item.toLowerCase() === label.toLowerCase())) ?? [];
  const ruc = values.find((row) => row[0]?.startsWith("RUC"))?.[0]?.replace(/RUC\s*:\s*/i, "") ?? "";
  const employer = values.find((row) => row[0]?.startsWith("Empleador"))?.[0]?.replace(/Empleador\s*:\s*/i, "") ?? "";
  const period = values.find((row) => row[0]?.startsWith("Periodo"))?.[0]?.replace(/Periodo\s*:\s*/i, "") ?? "";
  const personal = values[8] ?? [];
  const employment = values[10] ?? [];
  const work = values[13] ?? [];
  const incomeStart = values.findIndex((row) => row[0] === "Ingresos");
  const discountStart = values.findIndex((row) => row[0] === "Descuentos");
  const contributionsStart = values.findIndex((row) => row[0]?.toLowerCase().includes("aportes de empleador"));
  const parseItems = (start: number, end: number): PayrollItem[] => values.slice(start + 1, end < 0 ? values.length : end).filter((row) => /^\d/.test(row[0] ?? "")).map((row) => ({ code: row[0], concept: row[1], amount: money(row[2] || row[3]) }));
  const incomes = parseItems(incomeStart, discountStart);
  const discounts = parseItems(discountStart, contributionsStart);
  const employerContributions = parseItems(contributionsStart, values.length);
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalDiscounts = discounts.reduce((sum, item) => sum + item.amount, 0);
  const netRow = values.find((row) => row[0]?.toLowerCase() === "neto a pagar");
  const net = netRow ? money(netRow[1]) : totalIncome - totalDiscounts;
  return {
    employer, ruc, period, employee: personal[2] ?? "", dni: personal[1] ?? "", status: personal[3] ?? "",
    startDate: employment[0] ?? "", workerType: employment[1] ?? "", pension: employment[2] ?? "", cuspp: employment[3] ?? "",
    daysWorked: work[0] ?? "", daysSubsidized: work[2] ?? "", condition: work[3] ?? "", ordinaryHours: work[4] ?? "",
    incomes, discounts, employerContributions, totalIncome, totalDiscounts, net,
  };
}
