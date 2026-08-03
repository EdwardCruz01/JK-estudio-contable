export const feeTotal = (items = []) => items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

export const validFeeItems = (items = []) => items
  .map((item) => ({ id: item.id, description: String(item.description || "").trim(), amount: Number(item.amount || 0) }))
  .filter((item) => item.description && Number.isFinite(item.amount) && item.amount > 0);

export const defaultFeeGreeting = (company) => `Sr(a). ${company?.representative || "representante"}, representante de ${company?.name || "la empresa"}: reciba usted el cordial saludo de Estudio Contable JK. Por medio del presente documento le alcanzamos el detalle de los honorarios profesionales correspondientes a los servicios prestados.`;

export const feeFilename = (company, date) => `Honorarios-${String(company?.ruc || "empresa").replace(/[^\w-]/g, "")}-${date || new Date().toISOString().slice(0, 10)}`;
