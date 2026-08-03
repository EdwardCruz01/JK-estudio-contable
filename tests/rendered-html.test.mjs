import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Estudio JK public corporate site", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Estudio JK · Contable y Tributario<\/title>/i);
  assert.match(html, /Precisión contable/);
  assert.match(html, /Iniciar sesión/);
  assert.match(html, /Registrarse/);
  assert.match(html, /Soluciones con visión de negocio/);
  assert.match(html, /contacto@estudiojk.com.pe/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|codex-preview/i);
});

test("keeps the public auth, generators, history, and Supabase schema wired", async () => {
  const [page, publicSite, authScreen, authFile, template, fees, history, schema, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/PublicSite.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/AuthScreen.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/TemplateGenerator.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/HonorariosGenerator.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/History.tsx", import.meta.url), "utf8"),
    readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /PublicSite/); assert.match(page, /AuthScreen/); assert.match(page, /TemplateGenerator/); assert.match(page, /History/);
  assert.match(publicSite, /hero-section/); assert.match(publicSite, /servicios/);
  assert.match(authScreen, /auth\.signIn/); assert.match(authScreen, /auth\.register/); assert.match(authFile, /admin@estudiojk\.com\.pe/);
  assert.match(template, /parseSunatXml/); assert.match(template, /openPrintableDocument/); assert.match(fees, /const add/); assert.match(fees, /openPrintableDocument/);
  assert.match(history, /Eliminar/); assert.match(history, /Descargar/); assert.match(schema, /create table public\.plantillas_generadas/i); assert.match(schema, /create table public\.honorarios/i); assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
