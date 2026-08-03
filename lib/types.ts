export type Company = {
  id: string;
  name: string;
  legalName: string;
  ruc: string;
  address: string;
  district: string;
  province: string;
  department: string;
  phone: string;
  email: string;
  representative: string;
  logoData?: string;
  color: string;
  active: boolean;
  observations?: string;
  createdAt: string;
};

export type XmlPayroll = {
  employer: string;
  ruc: string;
  period: string;
  employee: string;
  dni: string;
  status: string;
  startDate: string;
  workerType: string;
  pension: string;
  cuspp: string;
  daysWorked: string;
  daysSubsidized: string;
  condition: string;
  ordinaryHours: string;
  incomes: PayrollItem[];
  discounts: PayrollItem[];
  employerContributions: PayrollItem[];
  totalIncome: number;
  totalDiscounts: number;
  net: number;
};

export type PayrollItem = { code: string; concept: string; amount: number };
export type FeeItem = { id: string; description: string; amount: number };

export type GeneratedDocument = {
  id: string;
  type: "boleta" | "honorarios";
  title: string;
  companyId: string;
  companyName: string;
  period?: string;
  amount: number;
  createdAt: string;
  payload: Record<string, unknown>;
};

export type View = "dashboard" | "companies" | "templates" | "fees" | "history";

