import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Estudio JK administrative shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Estudio JK · Panel administrativo<\/title>/i);
  assert.match(html, /Dashboard/);
  assert.match(html, /Generar plantillas/);
  assert.match(html, /Historial de archivos/);
  assert.match(html, /Modo local preparado para Supabase/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|codex-preview/i);
});

test("keeps the generators, history, and Supabase schema wired", async () => {
  const [page, template, fees, history, schema, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/TemplateGenerator.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/HonorariosGenerator.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/History.tsx", import.meta.url), "utf8"),
    readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /TemplateGenerator/);
  assert.match(page, /HonorariosGenerator/);
  assert.match(page, /History/);
  assert.match(template, /parseSunatXml/);
  assert.match(template, /openPrintableDocument/);
  assert.match(fees, /const add/);
  assert.match(fees, /openPrintableDocument/);
  assert.match(history, /Eliminar/);
  assert.match(history, /Descargar/);
  assert.match(schema, /create table public\.plantillas_generadas/i);
  assert.match(schema, /create table public\.honorarios/i);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
