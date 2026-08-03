"use client";

import { useState } from "react";

type PublicSiteProps = { onLogin: () => void; onRegister: () => void };

const services = [
  { icon: "▦", title: "Contabilidad integral", text: "Información financiera ordenada y oportuna para tomar decisiones con confianza." },
  { icon: "◈", title: "Tributación estratégica", text: "Cumplimiento, prevención y planificación tributaria para proteger el crecimiento de su negocio." },
  { icon: "⌁", title: "Planeamiento financiero", text: "Convertimos sus números en una ruta clara para mejorar rentabilidad y liquidez." },
  { icon: "◎", title: "Gestión laboral", text: "Planillas, beneficios sociales y soporte laboral con precisión y respaldo profesional." },
];

const team = [
  { name: "CPC. Javier Kohatsu Rojas", role: "Fundador · Contador Público Colegiado", text: "Dirección estratégica, tributación y planeamiento financiero." },
  { name: "María Álvarez", role: "Gerente contable", text: "NIIF · Estados financieros · Control de gestión" },
  { name: "Jorge Rivera", role: "Asesor tributario", text: "PDT · Fiscalizaciones · SUNAT" },
];

export function PublicSite({ onLogin, onRegister }: PublicSiteProps) {
  const [open, setOpen] = useState(false);
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };
  return <div className="public-site">
    <header className="public-nav">
      <a className="public-brand" href="#inicio" onClick={(event) => { event.preventDefault(); go("inicio"); }}><span className="public-brand-mark">JK</span><span><b>Estudio JK</b><small>CONTABLE · TRIBUTARIO</small></span></a>
      <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Abrir navegación">☰</button>
      <nav className={`public-links ${open ? "is-open" : ""}`}>
        <button className="active" onClick={() => go("inicio")}>Inicio</button><button onClick={() => go("nosotros")}>Nosotros</button><button onClick={() => go("servicios")}>Servicios</button><button onClick={() => go("equipo")}>Equipo</button><button onClick={() => go("contacto")}>Contacto</button>
      </nav>
      <div className="public-actions"><button className="login-link" onClick={onLogin}>↪ <span>Iniciar sesión</span></button><button className="gold-button public-register" onClick={onRegister}>♙ <span>Registrarse</span></button></div>
    </header>

    <main>
      <section id="inicio" className="hero-section">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="hero-content"><span className="hero-kicker">✣ ESTUDIO CONTABLE PREMIUM</span><h1>Precisión contable con la <em>confianza</em> que su empresa merece.</h1><p>En Estudio JK integramos experiencia, tecnología y una vocación de servicio impecable para gestionar la contabilidad, tributación y planeamiento financiero de su negocio.</p><div className="hero-actions"><button className="gold-button" onClick={() => go("contacto")}>Solicitar asesoría</button><button className="outline-light" onClick={() => go("contacto")}>Contáctanos</button></div></div><button className="scroll-cue" onClick={() => go("nosotros")} aria-label="Conocer el estudio">⌄</button>
      </section>

      <div className="trust-strip"><span>Con la precisión que su negocio necesita</span><div><b>CHÁVEZ</b><b>INVERSIONES ANDINAS</b><b>GRUPO TAMBO</b><b>ANDINOS</b></div></div>

      <section id="nosotros" className="public-section about-section"><div className="about-art"><span className="art-card art-card-main">JK</span><span className="art-card art-card-note">20+<small>AÑOS DE EXPERIENCIA</small></span><span className="art-line" /></div><div className="section-copy"><span className="public-eyebrow">NUESTRA FIRMA</span><h2>Un socio estratégico para cada etapa de su empresa.</h2><p>Somos un estudio contable peruano que acompaña a empresarios y organizaciones con información confiable, criterio técnico y una mirada práctica del negocio.</p><p>Trabajamos para que la complejidad contable y tributaria deje de ser una preocupación y se convierta en una ventaja para decidir mejor.</p><button className="arrow-link" onClick={() => go("contacto")}>Conozca cómo podemos ayudarle <span>→</span></button></div></section>

      <section id="servicios" className="public-section services-section"><div className="section-heading centered"><span className="public-eyebrow">LO QUE HACEMOS</span><h2>Soluciones con visión de negocio.</h2><p>Un equipo multidisciplinario, procesos ordenados y tecnología al servicio de sus decisiones.</p></div><div className="service-grid">{services.map((service) => <article className="service-card" key={service.title}><span className="service-icon">{service.icon}</span><h3>{service.title}</h3><p>{service.text}</p><a href="#contacto" onClick={(event) => { event.preventDefault(); go("contacto"); }}>Conocer servicio <span>↗</span></a></article>)}</div></section>

      <section id="equipo" className="public-section team-section"><div className="section-heading"><span className="public-eyebrow">NUESTRO EQUIPO</span><h2>Experiencia que se nota en cada detalle.</h2><p>Profesionales cercanos, rigurosos y comprometidos con los resultados de nuestros clientes.</p></div><div className="team-grid">{team.map((member, index) => <article className={`team-card team-card-${index}`} key={member.name}><div className="team-avatar">{member.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</div><div><h3>{member.name}</h3><span>{member.role}</span><p>{member.text}</p></div></article>)}</div></section>

      <section className="quote-section"><span className="quote-mark">“</span><blockquote>El nivel de detalle y proactividad del Estudio JK cambió nuestra gestión. Hoy tomamos decisiones con información en tiempo real.</blockquote><cite>Ronald Chávez · Gerente General, Corporación Chávez</cite></section>

      <section id="contacto" className="contact-section"><div><span className="public-eyebrow">HABLEMOS DE SU EMPRESA</span><h2>El siguiente paso empieza con una conversación.</h2><p>Cuéntenos qué necesita. Le responderemos con una ruta clara y concreta.</p></div><div className="contact-card"><a href="tel:+51950361967"><small>LLÁMENOS</small><b>950 361 967</b></a><a href="mailto:contacto@estudiojk.com.pe"><small>ESCRÍBANOS</small><b>contacto@estudiojk.com.pe</b></a><a href="https://wa.me/51950361967" target="_blank" rel="noreferrer" className="contact-cta">Solicitar asesoría <span>→</span></a></div></section>
    </main>

    <footer className="public-footer"><div className="public-brand"><span className="public-brand-mark">JK</span><span><b>Estudio JK</b><small>CONTABLE · TRIBUTARIO</small></span></div><span>© 2026 Estudio Contable JK. Todos los derechos reservados.</span><div><button onClick={onLogin}>Panel administrativo</button><a href="mailto:contacto@estudiojk.com.pe">Contacto</a></div></footer><a className="whatsapp-float" href="https://wa.me/51950361967" target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp">◔</a>
  </div>;
}
