# Estudio JK · Panel administrativo

Panel web para gestionar empresas, generar boletas PLAME R08 desde XML de SUNAT, emitir recibos por honorarios con múltiples conceptos y consultar/eliminar el historial de archivos generados.

## Ejecutar localmente

Requiere Node.js 22 o superior.

```bash
npm install
npm run dev
```

La aplicación funciona en modo local con datos de demostración y `localStorage`. Los botones de descarga abren una vista imprimible para elegir **Guardar como PDF**.

## Módulos incluidos

- Dashboard con métricas y actividad reciente.
- Empresas: alta, edición, estado, identidad, color y logo obligatorio para nuevas empresas.
- Plantillas: carga y lectura de XML real `SUNAT-PDT` / PLAME R08, selección de empresa, vista previa y PDF.
- Honorarios: múltiples conceptos, cálculo automático, saludo, observaciones, vista previa y PDF.
- Historial: acceso a documentos generados, descarga nuevamente y eliminación.

## Conectar Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta [`supabase/schema.sql`](supabase/schema.sql) en el SQL Editor.
3. Crea el bucket privado `documentos` y aplica políticas de Storage según el esquema.
4. Completa las variables de [`.env.example`](.env.example) o adapta `lib/config.ts` con la URL y la anon key del proyecto.
5. Sustituye el modo local de `lib/storage.ts` por las funciones de `lib/supabase.ts` en el punto de entrada que prefieras.

El esquema incluye usuarios, empresas, archivos, documentos, plantillas generadas, honorarios, actividad, logs, configuración, índices, triggers de actualización y RLS.

## Verificación

```bash
npm run build
npm test
```

## Estructura principal

- `app/`: shell de la aplicación.
- `components/`: dashboard, empresas, generadores, historial y previsualizaciones.
- `lib/xml-parser.ts`: extracción de datos del XML PLAME.
- `lib/document-renderer.ts`: plantillas imprimibles de boleta y honorarios.
- `supabase/schema.sql`: base de datos y políticas RLS.
