import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("includes the vanilla HTML entrypoint and asset wiring", async () => {
  const [html, css, app, page, packageJson] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../styles.css", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(html, /<!doctype html>/i); assert.match(html, /id="vanilla-app"/); assert.match(html, /styles\.css/); assert.match(html, /app\.js/); assert.match(css, /\.public-site/); assert.match(css, /\.app-shell/); assert.match(app, /parseSunatXml/); assert.match(app, /payrollDocument/); assert.match(app, /auth\.login/); assert.match(page, /vanilla-app/); assert.match(packageJson, /vinext/);
});

test("keeps vanilla modules for authentication, XML, templates and storage", async () => {
  const [auth, parser, templates, storage, supabaseSchema, publicHtml] = await Promise.all([
    readFile(new URL("../public/js/auth.js", import.meta.url), "utf8"), readFile(new URL("../public/js/xml-parser.js", import.meta.url), "utf8"), readFile(new URL("../public/js/templates.js", import.meta.url), "utf8"), readFile(new URL("../public/js/storage.js", import.meta.url), "utf8"), readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8"), readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  ]);
  assert.match(auth, /admin@estudiojk\.com\.pe/); assert.match(auth, /register/); assert.match(parser, /ss:Index/); assert.match(parser, /parseSunatXml/); assert.match(templates, /payrollDocument/); assert.match(templates, /feeDocument/); assert.match(templates, /downloadPayrollPdf/); assert.match(templates, /downloadFeePdf/); assert.match(templates, /drawPayrollLogo\(ctx, company, 925, 35, color\)/); assert.match(templates, /\["PERIODO", details\.period\]/); assert.match(templates, /Math\.min\(1580, Math\.max\(1565, contributionsEnd \+ 65\)\)/); assert.match(templates, /company\.logoData/); assert.match(templates, /company\.color/); assert.match(templates, /application\/pdf/); assert.match(storage, /localStorage/); assert.match(supabaseSchema, /create table public\.plantillas_generadas/i); assert.match(supabaseSchema, /create table public\.honorarios/i); await access(new URL("../public/hero-office.png", import.meta.url)); assert.match(publicHtml, /app\.js/);
});

test("ships the multi-section corporate site and supplied image assets", async () => {
  const [corporateJs, corporateCss] = await Promise.all([
    readFile(new URL("../public/corporate-pages.js", import.meta.url), "utf8"),
    readFile(new URL("../public/corporate.css", import.meta.url), "utf8"),
  ]);
  for (const word of ["Nosotros", "Servicios", "Equipo", "Contacto", "Contabilidad General", "Outsourcing Contable"]) assert.match(corporateJs, new RegExp(word));
  assert.match(corporateCss, /corporate-hero/); assert.match(corporateCss, /service-catalog/); assert.match(corporateCss, /contact-layout/);
  await Promise.all(["hero-accountant.png", "founder-javier.png", "team-maria.png", "team-jorge.png", "team-carla.png"].map((asset) => access(new URL(`../public/assets/${asset}`, import.meta.url))));
});

test("reads indexed PLAME R08 XML columns without losing amounts", async () => {
  const [xml, { parseSunatXml }] = await Promise.all([readFile(new URL("./fixtures/plame-r08.xml", import.meta.url), "utf8"), import("../public/js/xml-parser.js")]);
  const payroll = parseSunatXml(xml);
  assert.equal(payroll.employee, "RONALD RUBEN CHAVEZ CALDERON"); assert.equal(payroll.dni, "40654524"); assert.equal(payroll.period, "06/2026"); assert.equal(payroll.hoursWorked, "200"); assert.equal(payroll.incomes.length, 2); assert.equal(payroll.discounts.length, 2); assert.equal(payroll.incomes[0].amount, 1387); assert.equal(payroll.totalIncome, 1500); assert.equal(payroll.totalDiscounts, 193.8); assert.equal(payroll.employerContributions[0].amount, 135); assert.equal(payroll.net, 1306.2);
});

test("normalizes honorarium items and includes the Supabase persistence schema", async () => {
  const [{ feeTotal, validFeeItems }, schema, migration, client] = await Promise.all([import("../public/js/fees.js"), readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8"), readFile(new URL("../supabase/migration-001-enable-app-connection.sql", import.meta.url), "utf8"), import("../public/js/supabase-client.js")]);
  const items = validFeeItems([{ id: "a", description: " Contabilidad mensual ", amount: "850.50" }, { id: "b", description: "", amount: 30 }, { id: "c", description: "Soporte", amount: 0 }]);
  assert.deepEqual(items, [{ id: "a", description: "Contabilidad mensual", amount: 850.5 }]); assert.equal(feeTotal(items), 850.5); assert.equal(client.supabase.configured, false); assert.match(schema, /create table public\.honorarios/i); assert.match(schema, /create table public\.plantillas_generadas/i); assert.match(schema, /create trigger on_auth_user_created/i); assert.match(schema, /insert into storage\.buckets/i); assert.match(schema, /row level security/i); assert.match(migration, /add column if not exists empresa_id/i); assert.match(migration, /drop policy if exists "empresas_lectura_autorizada"/i); assert.match(migration, /insert into storage\.buckets/i);
});
