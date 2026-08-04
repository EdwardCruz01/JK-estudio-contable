const number = (value) => Number(String(value ?? "0").replace(/,/g, "").replace(/[^0-9.-]/g, "")) || 0;
const plain = (value) => String(value || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code))).trim();

// PLAME R08 is SpreadsheetML, not a conventional business XML. Its values are
// placed in Excel-style columns using ss:Index, so missing cells must not shift
// the data to the left while reading the document.
const rowsFrom = (xml) => [...String(xml).matchAll(/<(?:\w+:)?Row\b[^>]*>([\s\S]*?)<\/(?:\w+:)?Row>/gi)].map(([, body]) => {
  const row = {}; let position = 1;
  [...body.matchAll(/<(?:\w+:)?Cell\b([^>]*)>([\s\S]*?)<\/(?:\w+:)?Cell>/gi)].forEach(([, attributes, cell]) => {
    const index = Number((attributes.match(/(?:\w+:)?Index="(\d+)"/i) || [])[1] || position);
    const data = (cell.match(/<(?:\w+:)?Data\b[^>]*>([\s\S]*?)<\/(?:\w+:)?Data>/i) || [])[1] || "";
    row[index] = plain(data); position = index + 1;
  });
  return row;
});

const at = (row, column) => String(row?.[column] || "").trim();
const key = (value) => String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/Ã./g, "i");
const rowIndex = (rows, value) => rows.findIndex((row) => key(at(row, 2)) === key(value));
const nextDataRow = (rows, headerIndex, requiredColumns) => rows.slice(Math.max(0, headerIndex + 1)).find((row) => requiredColumns.every((column) => at(row, column))) || {};
const afterLabel = (rows, label) => {
  const row = rows.find((item) => key(at(item, 2)).startsWith(key(label)));
  return at(row, 2).replace(new RegExp(`^${label}\\s*:\\s*`, "i"), "");
};
const movements = (rows, start, end, amountColumn) => rows.slice(Math.max(0, start + 1), end > start ? end : rows.length)
  .filter((row) => /^\d+$/.test(at(row, 2)))
  .map((row) => ({ code: at(row, 2), concept: at(row, 3), amount: number(at(row, amountColumn)) }));

export function parseSunatXml(xml) {
  const rows = rowsFrom(xml);
  if (!rows.length) throw new Error("El XML no contiene filas legibles de PLAME R08.");

  const identity = nextDataRow(rows, rowIndex(rows, "Documento de Identidad"), [2, 3, 4]);
  const employment = nextDataRow(rows, rowIndex(rows, "Fecha de Ingreso"), [2, 4, 6]);
  const days = nextDataRow(rows, rowIndex(rows, "Días Laborados"), [2, 3, 4]);
  const incomesStart = rowIndex(rows, "Ingresos");
  const discountsStart = rowIndex(rows, "Descuentos");
  const netStart = rows.findIndex((row) => key(at(row, 2)) === "neto a pagar");
  const contributionsStart = rowIndex(rows, "Aportes de Empleador");
  const incomes = movements(rows, incomesStart, discountsStart, 7);
  const discounts = movements(rows, discountsStart, netStart, 8);
  const employerContributions = movements(rows, contributionsStart, rows.length, 9);
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalDiscounts = discounts.reduce((sum, item) => sum + item.amount, 0);
  const net = number(at(rows[netStart], 9));

  if (!at(identity, 3) || !at(identity, 4)) throw new Error("El XML no corresponde a una boleta individual PLAME R08 o está incompleto.");
  return { employer: afterLabel(rows, "Empleador"), ruc: afterLabel(rows, "RUC"), period: afterLabel(rows, "Periodo"), employee: at(identity, 4), dni: at(identity, 3), status: at(identity, 8), startDate: at(employment, 2), workerType: at(employment, 4), pension: at(employment, 6), cuspp: at(employment, 8), daysWorked: at(days, 2), daysNotWorked: at(days, 3), daysSubsidized: at(days, 4), condition: at(days, 5), hoursWorked: at(days, 6), ordinaryHours: at(days, 6), incomes, discounts, employerContributions, totalIncome, totalDiscounts, net: net || totalIncome - totalDiscounts };
}
