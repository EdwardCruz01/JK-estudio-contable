import type { Metadata } from "next";

export const metadata: Metadata = { title: "Estudio JK · Contable y Tributario", description: "Precisión contable, tributaria y financiera para empresas que quieren crecer con confianza.", icons: { icon: "/favicon.svg" } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}<link rel="stylesheet" href="/styles.css" /><script type="module" src="/app.js"></script></body></html>; }
