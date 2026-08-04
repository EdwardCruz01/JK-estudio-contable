import type { Metadata } from "next";
import Script from "next/script";
import "../styles.css";
import "../corporate.css";
import "../admin-safety.css";

export const metadata: Metadata = {
  title: "Estudio JK · Contable y Tributario",
  description: "Precisión contable, tributaria y financiera para empresas que quieren crecer con confianza.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}<Script src="/corporate-pages.js" strategy="beforeInteractive" /><Script src="/supabase-config.js" strategy="beforeInteractive" /><Script src="/app.js" type="module" strategy="afterInteractive" /></body></html>;
}
