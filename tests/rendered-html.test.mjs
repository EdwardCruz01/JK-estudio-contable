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
  assert.match(html, /<!doctype html>/i); assert.match(html, /id="vanilla-app"/); assert.match(html, /styles\.css/); assert.match(html, /app\.js/); assert.match(css, /\.public-site/); assert.match(css, /\.app-shell/); assert.match(app, /parseSunatXml/); assert.match(app, /payrollDocument/); assert.match(app, /auth\.login/); assert.match(app, /admin-message-form/); assert.match(app, /birthDate/); assert.match(page, /vanilla-app/); assert.match(packageJson, /vinext/);
});

test("keeps vanilla modules for authentication, XML, templates and storage", async () => {
  const [auth, parser, templates, storage, supabaseSchema, publicHtml] = await Promise.all([
    readFile(new URL("../public/js/auth.js", import.meta.url), "utf8"), readFile(new URL("../public/js/xml-parser.js", import.meta.url), "utf8"), readFile(new URL("../public/js/templates.js", import.meta.url), "utf8"), readFile(new URL("../public/js/storage.js", import.meta.url), "utf8"), readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8"), readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  ]);
  assert.match(auth, /admin@estudiojk\.com\.pe/); assert.match(auth, /register/); assert.match(parser, /ss:Index/); assert.match(parser, /parseSunatXml/); assert.match(templates, /payrollDocument/); assert.match(templates, /feeDocument/); assert.match(templates, /downloadPayrollPdf/); assert.match(templates, /downloadFeePdf/); assert.match(templates, /drawPayrollLogo\(ctx, company, 900, 20, color\)/); assert.match(templates, /feeCanvasV2/); assert.match(templates, /firma-digital-jk\.png/); assert.match(templates, /MEDIOS DE PAGO/); assert.match(templates, /data\.number \|\| data\.feeNumber \|\| 100/); assert.match(templates, /\["PERIODO", details\.period\]/); assert.match(templates, /height: 34, size: 16/); assert.match(templates, /Math\.min\(1605, Math\.max\(1575, contributionsEnd \+ 30\)\)/); assert.match(templates, /company\.logoData/); assert.match(templates, /company\.color/); assert.match(templates, /application\/pdf/); assert.match(storage, /localStorage/); assert.match(supabaseSchema, /create table public\.plantillas_generadas/i); assert.match(supabaseSchema, /create table public\.honorarios/i); await access(new URL("../public/hero-office.png", import.meta.url)); await access(new URL("../public/assets/firma-digital-jk.png", import.meta.url)); assert.match(publicHtml, /app\.js/);
});

test("ships the multi-section corporate site and supplied image assets", async () => {
  const [corporateJs, corporateCss] = await Promise.all([
    readFile(new URL("../public/corporate-pages.js", import.meta.url), "utf8"),
    readFile(new URL("../public/corporate.css", import.meta.url), "utf8"),
  ]);
  for (const word of ["Nosotros", "Servicios", "Equipo", "Contacto", "Contabilidad General", "Outsourcing Contable"]) assert.match(corporateJs, new RegExp(word));
  assert.match(corporateCss, /corporate-hero/); assert.match(corporateCss, /service-catalog/); assert.match(corporateCss, /contact-layout/); assert.match(corporateCss, /site-flyer/); assert.match(corporateCss, /corporate-banner/); assert.match(corporateCss, /client-marquee img/); assert.match(corporateJs, /jk-home-flyer-2026\.jpg/); assert.match(corporateJs, /flyerStorageKey/); assert.match(corporateJs, /whatsapp-jk-v2\.png/); assert.match(corporateJs, /contact-banner\.png/); assert.match(corporateJs, /services-banner\.png/); assert.match(corporateJs, /logo-trimar\.jpg/);
  await Promise.all(["hero-accountant.png", "founder-javier.png", "founder-jimm.png", "logistica-flyer.jpeg", "jk-home-flyer-2026.jpg", "whatsapp-jk-v2.png", "team-maria.png", "team-jorge.png", "team-carla.png", "contact-banner.png", "services-banner.png", "logo-trimar.jpg", "logo-market-tuki.jpg", "logo-amazon.jpg", "logo-chavez.jpg", "logo-logistica.jpg", "logo-real-huanuco.jpg", "logo-yed.jpg", "logo-distribuidora-chavez.jpg"].map((asset) => access(new URL(`../public/assets/${asset}`, import.meta.url))));
});

test("reads indexed PLAME R08 XML columns without losing amounts", async () => {
  const [xml, { parseSunatXml }] = await Promise.all([readFile(new URL("./fixtures/plame-r08.xml", import.meta.url), "utf8"), import("../public/js/xml-parser.js")]);
  const payroll = parseSunatXml(xml);
  assert.equal(payroll.employee, "RONALD RUBEN CHAVEZ CALDERON"); assert.equal(payroll.dni, "40654524"); assert.equal(payroll.period, "06/2026"); assert.equal(payroll.hoursWorked, "200"); assert.equal(payroll.incomes.length, 2); assert.equal(payroll.discounts.length, 2); assert.equal(payroll.incomes[0].amount, 1387); assert.equal(payroll.totalIncome, 1500); assert.equal(payroll.totalDiscounts, 193.8); assert.equal(payroll.employerContributions[0].amount, 135); assert.equal(payroll.net, 1306.2);
});

test("keeps an uploaded logo available while Supabase refreshes signed URLs", async () => {
  const [app, client, templates, storage] = await Promise.all([readFile(new URL("../public/app.js", import.meta.url), "utf8"), readFile(new URL("../public/js/supabase-client.js", import.meta.url), "utf8"), readFile(new URL("../public/js/templates.js", import.meta.url), "utf8"), readFile(new URL("../public/js/storage.js", import.meta.url), "utf8")]);
  assert.match(client, /const noLogoPaths/); assert.match(client, /value\?\.signedURL \|\| value\?\.signedUrl/); assert.match(client, /async logoUrl\(path, token\)/); assert.match(client, /logo-\$\{Date\.now\(\)\}/); assert.match(client, /assertLogoFile/); assert.match(app, /Promise\.allSettled/); assert.match(app, /refreshCompanyLogoForDocument/); assert.match(app, /cachedLogoSource/); assert.match(app, /root\.addEventListener\("error"/); assert.match(templates, /requireStoredLogo/); assert.match(templates, /setTimeout\(\(\) => finish\(null\), 8000\)/); assert.match(storage, /cachedCompanies/);
});

test("builds valid Supabase logo URLs and accepts both documented response casings", async () => {
  const originalConfig = globalThis.JK_SUPABASE_CONFIG;
  const originalFetch = globalThis.fetch;
  globalThis.JK_SUPABASE_CONFIG = { url: "https://demo.supabase.co", anonKey: "public-test-key" };
  globalThis.fetch = async (url) => {
    const parsed = new URL(url);
    if (parsed.pathname === "/rest/v1/empresas") return new Response(JSON.stringify([{ id: "a6b506b5-2367-4a07-a803-1489d8b7e015", nombre: "Empresa de prueba", razon_social: "Empresa de prueba", ruc: "20123456789", direccion: "Jr. Prueba 123", logo_url: "a6b506b5-2367-4a07-a803-1489d8b7e015/logo.png", color_corporativo: "#B49141", estado: true }]), { headers: { "content-type": "application/json" } });
    if (parsed.pathname.startsWith("/storage/v1/object/sign/logos/")) return new Response(JSON.stringify({ signedUrl: "/object/sign/logos/a6b506b5-2367-4a07-a803-1489d8b7e015/logo.png?token=ok" }), { headers: { "content-type": "application/json" } });
    throw new Error(`Ruta no esperada: ${parsed.pathname}`);
  };
  try {
    const moduleUrl = new URL(`../js/supabase-client.js?logo-test=${Date.now()}`, import.meta.url);
    const { supabase } = await import(moduleUrl.href);
    const [company] = await supabase.companies("session-token");
    assert.equal(company.logoData, "https://demo.supabase.co/storage/v1/object/sign/logos/a6b506b5-2367-4a07-a803-1489d8b7e015/logo.png?token=ok");
    assert.equal(await supabase.logoUrl("sin-logo", "session-token"), "");
    await assert.rejects(() => supabase.saveCompany({ ...company, logoPath: "a6b506b5-2367-4a07-a803-1489d8b7e015/logo.png" }, { type: "image/gif", size: 42 }, "session-token"), /PNG o JPG/);
    const requests = [];
    globalThis.fetch = async (url, options = {}) => {
      const parsed = new URL(url); requests.push({ path: parsed.pathname, method: options.method || "GET", body: options.body });
      if (parsed.pathname.startsWith("/storage/v1/object/sign/logos/")) return new Response(JSON.stringify({ signedURL: "/object/sign/logos/fresh-logo.png?token=ok" }), { headers: { "content-type": "application/json" } });
      if (parsed.pathname === "/rest/v1/empresas") { const body = JSON.parse(options.body); return new Response(JSON.stringify([{ ...body }]), { headers: { "content-type": "application/json" } }); }
      return new Response("", { status: 200 });
    };
    const saved = await supabase.saveCompany(company, { type: "image/png", size: 42 }, "session-token");
    assert.match(saved.logoPath, /\/logo-\d+\.png$/);
    assert.ok(requests.some((request) => request.method === "POST" && request.path.includes("/storage/v1/object/logos/") && /logo-\d+\.png$/.test(request.path)));
    assert.ok(requests.some((request) => request.method === "DELETE" && request.path.endsWith("/a6b506b5-2367-4a07-a803-1489d8b7e015/logo.png")));
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.JK_SUPABASE_CONFIG = originalConfig;
  }
});

test("normalizes honorarium items and includes the Supabase persistence schema", async () => {
  const [{ feeTotal, validFeeItems }, schema, migration, client] = await Promise.all([import("../public/js/fees.js"), readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8"), readFile(new URL("../supabase/migration-001-enable-app-connection.sql", import.meta.url), "utf8"), import("../public/js/supabase-client.js")]);
  const items = validFeeItems([{ id: "a", description: " Contabilidad mensual ", amount: "850.50" }, { id: "b", description: "", amount: 30 }, { id: "c", description: "Soporte", amount: 0 }]);
  assert.deepEqual(items, [{ id: "a", description: "Contabilidad mensual", amount: 850.5 }]); assert.equal(feeTotal(items), 850.5); assert.equal(client.supabase.configured, false); assert.match(schema, /create table public\.honorarios/i); assert.match(schema, /create table public\.plantillas_generadas/i); assert.match(schema, /create trigger on_auth_user_created/i); assert.match(schema, /insert into storage\.buckets/i); assert.match(schema, /row level security/i); assert.match(migration, /add column if not exists empresa_id/i); assert.match(migration, /drop policy if exists "empresas_lectura_autorizada"/i); assert.match(migration, /insert into storage\.buckets/i);
});
