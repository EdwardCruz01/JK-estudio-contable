# Estudio JK · Plataforma corporativa

La interfaz principal está construida con HTML, CSS y JavaScript nativo, organizada por módulos reutilizables. Incluye el sitio corporativo, autenticación local, portal de clientes, panel administrativo, generación de boletas PLAME, honorarios e historial.

## Ejecutar

```bash
npm install
npm run dev
```

Abra la URL local que muestra la terminal. También puede revisar `index.html` como punto de entrada estático; para que funcionen módulos, localStorage y generación de documentos debe servirse mediante el servidor de desarrollo.

## Estructura principal

- `index.html`: entrada HTML de la aplicación.
- `styles.css`: estilos corporativos, responsive, autenticación y panel.
- `app.js`: orquestador de vistas y eventos.
- `js/`: módulos JavaScript para autenticación, almacenamiento, XML y plantillas.
- `public/index.html`, `public/app.js`, `public/styles.css`: copia servible para el runtime de publicación.
- `public/hero-office.png`: imagen hero corporativa.
- `supabase/schema.sql`: tablas, relaciones, RLS, triggers e índices para Supabase.

El proyecto conserva un adaptador mínimo de publicación compatible con Sites; no participa en la interfaz ni en la lógica de negocio. La aplicación visible y sus generadores son HTML/CSS/JavaScript.

## Acceso local

Administrador: `admin@estudiojk.com.pe` · contraseña `12345`.

Los registros de clientes funcionan localmente con `localStorage`. Al configurar Supabase se puede sustituir el adaptador de autenticación y persistencia sin cambiar las vistas.

## Verificación

```bash
npm run build
npm test
```
