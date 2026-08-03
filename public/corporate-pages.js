(function () {
  const services = [
    ["▦", "Contabilidad General", "Registro contable completo bajo NIIF y normas SUNAT."],
    ["$", "Asesoría Tributaria", "Cumplimiento fiscal y optimización responsable de la carga tributaria."],
    ["↗", "Asesoría Financiera", "Análisis y proyecciones que convierten datos en decisiones."],
    ["✓", "Planeamiento Tributario", "Estrategias legales para reducir riesgos y contingencias."],
    ["▤", "Declaraciones SUNAT", "PDT, PLE, PLAME y declaraciones mensuales o anuales."],
    ["▣", "Planillas", "Gestión de remuneraciones, beneficios y obligaciones laborales."],
    ["▱", "Boletas de Pago", "Emisión digital ordenada y conforme a la normativa vigente."],
    ["⌂", "Constitución de Empresas", "Creación de sociedades y trámites en SUNARP y SUNAT."],
    ["⌕", "Auditoría", "Revisión financiera, tributaria y operativa con criterio independiente."],
    ["▥", "Estados Financieros", "Elaboración y análisis interpretativo de EE.FF."],
    ["◫", "Facturación Electrónica", "Implementación y soporte para sus comprobantes electrónicos."],
    ["▥", "Outsourcing Contable", "Tercerización integral para operar con orden y control."],
    ["♙", "Recursos Humanos", "Selección, gestión y desarrollo del capital humano."],
    ["⚖", "Asesoría Laboral", "Cumplimiento normativo y relaciones laborales saludables."],
    ["◉", "Consultoría Empresarial", "Diagnóstico y mejora continua de procesos de negocio."],
    ["✦", "Formalización de Negocios", "Acompañamiento para iniciar y consolidar su empresa."],
  ];

  const nav = (page) => `
    <header class="public-nav corporate-nav">
      <button class="public-brand" data-public-page="home" aria-label="Ir al inicio"><span class="public-brand-mark">JK</span><span><b>Estudio JK</b><small>CONTABLE · TRIBUTARIO</small></span></button>
      <button class="mobile-toggle" data-action="mobile" aria-label="Abrir navegación">☰</button>
      <nav class="public-links">${[["home","Inicio"],["about","Nosotros"],["services","Servicios"],["team","Equipo"],["contact","Contacto"]].map(([id, label]) => `<button class="${page === id ? "active" : ""}" data-public-page="${id}">${label}</button>`).join("")}</nav>
      <div class="public-actions"><button class="login-link" data-action="login">↪ <span>Iniciar sesión</span></button><button class="gold-button public-register" data-action="register">♙ <span>Registrarse</span></button></div>
    </header>`;

  const footer = () => `<footer class="public-footer corporate-footer"><div class="public-brand"><span class="public-brand-mark">JK</span><span><b>Estudio JK</b><small>CONTABLE · TRIBUTARIO</small></span></div><div><b>Información clara para decidir mejor.</b><span>Contabilidad, tributación y gestión empresarial.</span></div><div><button data-public-page="contact">Contacto</button><button data-action="login">Panel administrativo</button></div><small>© 2026 Estudio Contable JK. Todos los derechos reservados.</small></footer><a class="whatsapp-float" href="https://wa.me/51950361967" target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp">◔</a>`;

  const pageHead = (eyebrow, title, copy) => `<section class="page-heading"><span class="public-eyebrow">${eyebrow}</span><h1>${title}</h1><p>${copy}</p></section>`;
  const serviceCards = (limit) => services.slice(0, limit || services.length).map(([icon, title, copy]) => `<article class="service-catalog-card"><span class="service-icon">${icon}</span><h3>${title}</h3><p>${copy}</p><button class="arrow-link" data-service="${title}">Solicitar <span>→</span></button></article>`).join("");

  function home() {
    return `<main>
      <section class="corporate-hero"><div class="corporate-hero-image" aria-hidden="true"></div><div class="corporate-hero-overlay"></div><div class="corporate-hero-content"><span class="hero-kicker">✣ ESTUDIO CONTABLE PREMIUM</span><h1>Precisión contable con la <em>confianza</em> que su empresa merece.</h1><p>Integramos experiencia, tecnología y una vocación de servicio impecable para gestionar la contabilidad, tributación y planeamiento financiero de su negocio.</p><div class="hero-actions"><button class="gold-button" data-public-page="contact">Solicitar asesoría</button><button class="outline-light" data-public-page="about">Conózcanos</button></div></div></section>
      <section class="client-strip"><span>Empresas que confían en nuestro método</span><div><b>CORPORACIÓN CHÁVEZ</b><b>INVERSIONES ANDINAS</b><b>GRUPO TAMBO</b><b>SERVICIOS ANDINOS</b></div></section>
      <section class="corporate-section split-intro"><div><span class="public-eyebrow">NUESTRA FORMA DE TRABAJAR</span><h2>Una mirada completa para una gestión más segura.</h2></div><div><p>Convertimos obligaciones contables y tributarias en información útil para que usted tome decisiones con tranquilidad.</p><button class="arrow-link" data-public-page="about">Conozca el estudio <span>→</span></button></div></section>
      <section class="corporate-section muted-section"><div class="section-heading"><span class="public-eyebrow">SERVICIOS DESTACADOS</span><h2>Respaldo técnico para cada reto del negocio.</h2><p>Un portafolio integral, coordinado por especialistas y adaptado al momento de su empresa.</p></div><div class="service-catalog service-catalog-short">${serviceCards(4)}</div><div class="section-cta"><button class="outline-dark" data-public-page="services">Ver todos los servicios</button></div></section>
      <section class="corporate-section metrics-section"><article><strong>20+</strong><span>Años acompañando empresas</span></article><article><strong>300+</strong><span>Clientes atendidos en Perú</span></article><article><strong>16</strong><span>Soluciones especializadas</span></article><article><strong>24 h</strong><span>Tiempo objetivo de respuesta</span></article></section>
      <section class="corporate-section testimonial-banner"><div><span class="quote-mark">“</span><blockquote>El nivel de detalle y proactividad del Estudio JK cambió nuestra gestión. Hoy tomamos decisiones con información en tiempo real.</blockquote><cite>Ronald Chávez · Gerente General, Corporación Chávez</cite></div><button class="gold-button" data-public-page="contact">Conversemos</button></section>
    </main>`;
  }

  function about() {
    return `<main>${pageHead("NOSOTROS", "Más que un estudio: un socio para el crecimiento.", "Acompañamos a empresas peruanas con información confiable, criterio técnico y una mirada práctica del negocio.")}
      <section class="corporate-section about-story"><div class="about-photo"><img src="/assets/hero-accountant.png" alt="Asesor revisando información financiera" /></div><div><span class="public-eyebrow">NUESTRA FIRMA</span><h2>La rigurosidad que necesita, con la cercanía que espera.</h2><p>Estudio JK nace con el propósito de hacer más clara la gestión contable y tributaria de las empresas. Combinamos procesos ordenados, actualización permanente y una comunicación directa.</p><p>No trabajamos solo para presentar declaraciones: organizamos su información para anticipar escenarios, proteger el cumplimiento y sostener el crecimiento.</p><button class="gold-button" data-public-page="contact">Solicitar una reunión</button></div></section>
      <section class="corporate-section values-section"><div class="section-heading centered"><span class="public-eyebrow">NUESTROS PRINCIPIOS</span><h2>Una relación basada en confianza.</h2></div><div class="values-grid"><article><b>01</b><h3>Rigor técnico</h3><p>Aplicamos la normativa con precisión y criterio profesional.</p></article><article><b>02</b><h3>Visión de negocio</h3><p>Traducimos los números a decisiones accionables.</p></article><article><b>03</b><h3>Comunicación cercana</h3><p>Respondemos con claridad, oportunidad y lenguaje simple.</p></article><article><b>04</b><h3>Mejora continua</h3><p>Actualizamos procesos y herramientas para servir mejor.</p></article></div></section>
      <section class="corporate-section methodology"><div><span class="public-eyebrow">METODOLOGÍA</span><h2>Orden, seguimiento y resultados visibles.</h2></div><ol><li><span>1</span><div><b>Diagnóstico</b><p>Entendemos su operación, riesgos y objetivos.</p></div></li><li><span>2</span><div><b>Plan de trabajo</b><p>Definimos entregables, responsables y prioridades.</p></div></li><li><span>3</span><div><b>Acompañamiento</b><p>Ejecutamos y comunicamos avances de forma periódica.</p></div></li><li><span>4</span><div><b>Decisión</b><p>Entregamos información clara para gestionar mejor.</p></div></li></ol></section>
    </main>`;
  }

  function servicesPage() { return `<main>${pageHead("SERVICIOS", "Todo lo que su empresa necesita, en un solo estudio.", "Un portafolio integral diseñado para acompañarle desde la formalización hasta la consolidación financiera.")}
    <section class="corporate-section services-catalog-section"><div class="service-catalog">${serviceCards()}</div></section>
    <section class="corporate-section service-cta"><div><span class="public-eyebrow">¿NO SABE POR DÓNDE EMPEZAR?</span><h2>Cuéntenos su situación y le orientamos.</h2><p>Una conversación inicial nos permite recomendarle el servicio que más valor puede aportar a su empresa.</p></div><button class="gold-button" data-public-page="contact">Solicitar asesoría</button></section>
  </main>`; }

  function team() { return `<main>${pageHead("NUESTRO EQUIPO", "Profesionales que entienden su negocio.", "Un equipo multidisciplinario que combina conocimiento técnico, experiencia y vocación de servicio.")}
    <section class="corporate-section founder-section"><div class="founder-image"><img src="/assets/founder-javier.png" alt="CPC. Javier Kohatsu Rojas" /><span>CONTADOR PRINCIPAL</span></div><div><span class="public-eyebrow">LIDERAZGO</span><h2>CPC. Javier Kohatsu Rojas</h2><h3>Fundador · Contador Público Colegiado</h3><p>Con más de 20 años de trayectoria, lidera un equipo multidisciplinario que ha atendido a más de 300 empresas peruanas. Especialista en tributación, NIIF y planeamiento financiero estratégico.</p><p>Su enfoque combina precisión técnica, prevención de riesgos y cercanía en la toma de decisiones.</p></div></section>
    <section class="corporate-section"><div class="section-heading centered"><span class="public-eyebrow">ESPECIALISTAS</span><h2>Conocimiento que se complementa.</h2></div><div class="people-grid"><article><img src="/assets/team-maria.png" alt="María Álvarez" /><h3>María Álvarez</h3><span>GERENTE CONTABLE</span><p>NIIF · Estados Financieros · Control de gestión</p></article><article><img src="/assets/team-jorge.png" alt="Jorge Rivera" /><h3>Jorge Rivera</h3><span>ASESOR TRIBUTARIO</span><p>PDT · Fiscalizaciones · SUNAT</p></article><article><img src="/assets/team-carla.png" alt="Carla Mendoza" /><h3>Carla Mendoza</h3><span>CONSULTORA LABORAL</span><p>Planillas · Recursos Humanos · Relaciones laborales</p></article></div></section>
  </main>`; }

  function contact(selectedService) { return `<main>${pageHead("CONTACTO", "Conversemos sobre su empresa.", "Complete el formulario y un asesor de Estudio Contable JK le contactará en menos de 24 horas.")}
    <section class="corporate-section contact-layout"><form id="corporate-contact-form" class="corporate-form"><div class="form-grid"><label>Nombre completo<input required name="name" placeholder="Ej. María Pérez" /></label><label>Correo<input required type="email" name="email" placeholder="correo@empresa.com" /></label><label>Teléfono<input name="phone" placeholder="+51 999 000 000" /></label><label>Empresa<input name="company" placeholder="Razón social" /></label></div><label>Servicio de interés<input id="contact-service" name="service" value="${selectedService || ""}" placeholder="Seleccione o describa el servicio" /></label><label>Mensaje<textarea required name="message" rows="6" placeholder="Cuéntenos brevemente su necesidad"></textarea></label><button class="gold-button" type="submit">✈ Enviar mensaje</button><p class="form-feedback" aria-live="polite"></p></form><aside class="contact-details"><a href="https://maps.google.com/?q=Chile,+Amarilis,+Hu%C3%A1nuco,+Per%C3%BA" target="_blank" rel="noreferrer"><span>⌖</span><div><small>DIRECCIÓN</small><b>Chile, Amarilis 00011 — Huánuco, Perú</b></div></a><a href="mailto:contacto@estudiojk.com.pe"><span>✉</span><div><small>CORREO</small><b>contacto@estudiojk.com.pe</b></div></a><a href="tel:+51950361967"><span>☎</span><div><small>TELÉFONO</small><b>950 361 967</b></div></a><a href="https://wa.me/51950361967" target="_blank" rel="noreferrer"><span>◔</span><div><small>WHATSAPP</small><b>+51 950 361 967</b></div></a><div><span>◷</span><div><small>HORARIO</small><b>Lun a Vie · 9:00 a 18:00 · Sáb 9:00 a 13:00</b></div></div></aside></section>
  </main>`; }

  function view(page, selectedService) {
    const safePage = ["home", "about", "services", "team", "contact"].includes(page) ? page : "home";
    const content = { home: home(), about: about(), services: servicesPage(), team: team(), contact: contact(selectedService) }[safePage];
    return `<div class="public-site corporate-site">${nav(safePage)}${content}${footer()}</div>`;
  }

  window.JKCorporate = { view };
})();
