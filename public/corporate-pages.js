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
  const serviceSummaries = {
    "Contabilidad General": "Ordenamos sus registros, conciliaciones y reportes para que su empresa cuente con información financiera confiable y disponible a tiempo.",
    "Asesoría Tributaria": "Revisamos sus obligaciones y planteamos acciones preventivas para cumplir correctamente y reducir contingencias tributarias.",
    "Asesoría Financiera": "Transformamos sus datos en indicadores, proyecciones y recomendaciones prácticas para fortalecer la rentabilidad y liquidez.",
    "Planeamiento Tributario": "Diseñamos alternativas legales y ordenadas para anticipar riesgos y tomar decisiones tributarias con mayor seguridad.",
    "Declaraciones SUNAT": "Gestionamos PDT, PLE, PLAME y declaraciones periódicas con seguimiento de plazos y validación de la información declarada.",
    "Planillas": "Administramos remuneraciones, beneficios y obligaciones laborales para que su equipo y su empresa estén siempre al día.",
    "Boletas de Pago": "Preparamos boletas de pago claras y consistentes con la información de planilla de cada trabajador.",
    "Constitución de Empresas": "Le acompañamos desde la elección de la forma societaria hasta los trámites necesarios para iniciar operaciones formalmente.",
    "Auditoría": "Evaluamos procesos financieros, tributarios y operativos para identificar oportunidades de mejora y fortalecer los controles.",
    "Estados Financieros": "Elaboramos y analizamos estados financieros que le permiten conocer la situación real de su negocio.",
    "Facturación Electrónica": "Le ayudamos a implementar y mantener una emisión electrónica ordenada, alineada con las exigencias de SUNAT.",
    "Outsourcing Contable": "Ponemos a disposición un equipo contable externo para que usted se concentre en la operación y crecimiento de su empresa.",
    "Recursos Humanos": "Apoyamos la gestión del talento con procesos de selección, administración y acompañamiento al equipo.",
    "Asesoría Laboral": "Brindamos orientación para prevenir contingencias y manejar correctamente las relaciones laborales.",
    "Consultoría Empresarial": "Analizamos su operación para convertir problemas cotidianos en procesos más claros, medibles y sostenibles.",
    "Formalización de Negocios": "Acompañamos la formalización de su emprendimiento para que pueda operar y crecer sobre una base sólida.",
  };
  const whatsappIcon = (className = "") => `<img class="${className}" src="/assets/whatsapp-jk-v2.png" alt="" aria-hidden="true">`;
  const corporateLogo = `<img class="corporate-logo" src="/assets/jk-logo.png" alt="JK Asesores Contables">`;

  const nav = (page) => `
    <header class="public-nav corporate-nav">
      <button class="public-brand" data-public-page="home" aria-label="Ir al inicio">${corporateLogo}</button>
      <button class="mobile-toggle" data-action="mobile" aria-label="Abrir navegación">☰</button>
      <nav class="public-links">${[["home","Inicio"],["about","Nosotros"],["services","Servicios"],["team","Equipo"],["contact","Contacto"]].map(([id, label]) => `<button class="${page === id ? "active" : ""}" data-public-page="${id}">${label}</button>`).join("")}</nav>
      <div class="public-actions"><button class="quote-button" data-public-page="contact">Cotizar</button><button class="login-link" data-action="login">↪ <span>Iniciar sesión</span></button><button class="gold-button public-register" data-action="register">♙ <span>Registrarse</span></button></div>
    </header>`;

  const footer = () => `<footer class="public-footer corporate-footer"><div class="public-brand">${corporateLogo}</div><div><b>Información clara para decidir mejor.</b><span>Contabilidad, tributación y gestión empresarial.</span></div><div><button data-public-page="contact">Contacto</button><button data-action="login">Panel administrativo</button></div><small>© 2026 JK Asesores Contables. Todos los derechos reservados.</small></footer><a class="whatsapp-float" href="https://wa.me/51950361967" target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp">${whatsappIcon("whatsapp-logo-image")}</a>`;

  const pageHead = (eyebrow, title, copy) => `<section class="page-heading"><span class="public-eyebrow">${eyebrow}</span><h1>${title}</h1><p>${copy}</p></section>`;
  const serviceCards = (limit) => services.slice(0, limit || services.length).map(([icon, title, copy]) => `<article class="service-catalog-card"><span class="service-icon">${icon}</span><h3>${title}</h3><p>${copy}</p><button class="arrow-link" data-service-summary="${title}" aria-haspopup="dialog">Ver resumen <span>→</span></button></article>`).join("");

  function home() {
    return `<main>
      <section class="corporate-hero"><div class="corporate-hero-image" aria-hidden="true"></div><div class="corporate-hero-overlay"></div><div class="corporate-hero-content"><span class="hero-kicker">✣ ESTUDIO CONTABLE PREMIUM</span><h1>Precisión contable con la <em>confianza</em> que su empresa merece.</h1><p>Integramos experiencia, tecnología y una vocación de servicio impecable para gestionar la contabilidad, tributación y planeamiento financiero de su negocio.</p><div class="hero-actions"><button class="gold-button" data-public-page="contact">Cotizar ahora</button><button class="outline-light" data-public-page="about">Conózcanos</button></div></div></section>
      <section class="corporate-section client-story-section"><div class="section-heading centered"><span class="public-eyebrow">NUESTROS CLIENTES</span><h2>Empresas que confían en nosotros</h2><p>La confianza se construye con información oportuna, criterio profesional y acompañamiento constante.</p></div><div class="client-marquee" aria-label="Logos de empresas que confían en Estudio JK"><div class="client-marquee-track"><span><img src="/assets/logo-chavez.jpg" alt="Corporación Chávez" /></span><span><img src="/assets/logo-real-huanuco.jpg" alt="Escuela Formativa de Fútbol Real Huánuco" /></span><span><img src="/assets/logo-yed.jpg" alt="Constructora y Consultora YED" /></span><span><img src="/assets/logo-amazon.jpg" alt="Amazon Home Center" /></span><span><img src="/assets/logo-trimar.jpg" alt="Comercializadora Trimar" /></span><span><img src="/assets/logo-market-tuki.jpg" alt="Market Tuki Tuki" /></span><span><img src="/assets/logo-logistica.jpg" alt="Transportes Generales DEA" /></span><span><img src="/assets/logo-distribuidora-chavez.jpg" alt="Distribuidora Chávez" /></span><span><img src="/assets/logo-chavez.jpg" alt="Corporación Chávez" /></span><span><img src="/assets/logo-real-huanuco.jpg" alt="Escuela Formativa de Fútbol Real Huánuco" /></span><span><img src="/assets/logo-yed.jpg" alt="Constructora y Consultora YED" /></span><span><img src="/assets/logo-amazon.jpg" alt="Amazon Home Center" /></span><span><img src="/assets/logo-trimar.jpg" alt="Comercializadora Trimar" /></span><span><img src="/assets/logo-market-tuki.jpg" alt="Market Tuki Tuki" /></span><span><img src="/assets/logo-logistica.jpg" alt="Transportes Generales DEA" /></span><span><img src="/assets/logo-distribuidora-chavez.jpg" alt="Distribuidora Chávez" /></span></div></div><div class="client-testimonials"><article class="client-testimonial-card"><span class="quote-mark">“</span><blockquote>El nivel de detalle y proactividad del Estudio JK cambió nuestra gestión. Hoy tomamos decisiones con información en tiempo real.</blockquote><cite>Ronald Chávez <small>Gerente General · Corporación Chávez</small></cite></article><article class="client-testimonial-card"><span class="quote-mark">“</span><blockquote>Cero contingencias tributarias en cuatro años. Un equipo profesional, cercano y siempre disponible.</blockquote><cite>María Torres <small>Directora · Inversiones Pacífico</small></cite></article><article class="client-testimonial-card"><span class="quote-mark">“</span><blockquote>Nos formalizaron y hoy nos acompañan en todo. Un verdadero socio estratégico para nuestro crecimiento.</blockquote><cite>Luis Fernández <small>Fundador · Servicios Andinos</small></cite></article></div><div class="section-cta"><button class="gold-button" data-public-page="contact">Conversemos</button></div></section>
      <section class="corporate-section split-intro"><div><span class="public-eyebrow">NUESTRA FORMA DE TRABAJAR</span><h2>Una mirada completa para una gestión más segura.</h2></div><div><p>Convertimos obligaciones contables y tributarias en información útil para que usted tome decisiones con tranquilidad.</p><button class="arrow-link" data-public-page="about">Conozca el estudio <span>→</span></button></div></section>
      <section class="corporate-section muted-section"><div class="section-heading"><span class="public-eyebrow">SERVICIOS DESTACADOS</span><h2>Respaldo técnico para cada reto del negocio.</h2><p>Un portafolio integral, coordinado por especialistas y adaptado al momento de su empresa.</p></div><div class="service-catalog service-catalog-short">${serviceCards(4)}</div><div class="section-cta"><button class="outline-dark" data-public-page="services">Ver todos los servicios</button></div></section>
      <section class="corporate-section metrics-section"><article><strong data-counter="15" data-counter-suffix="+">0</strong><span>Años acompañando empresas</span></article><article><strong data-counter="300" data-counter-suffix="+">0</strong><span>Clientes atendidos en Perú</span></article><article><strong data-counter="16">0</strong><span>Soluciones especializadas</span></article><article><strong data-counter="24" data-counter-suffix=" h">0</strong><span>Tiempo objetivo de respuesta</span></article></section>
    </main>`;
  }

  function about() {
    return `<main class="public-page public-page-about">
      <section class="corporate-section page-hero page-hero-about"><div class="page-hero-copy"><span class="public-eyebrow">SOBRE NOSOTROS</span><h1>Quince años cuidando la salud financiera de sus empresas</h1><p>Estudio JK nació con la convicción de que la contabilidad debe ser una herramienta estratégica, no un trámite. Combinamos disciplina profesional, estándares internacionales y tecnología para entregar información clara, oportuna y accionable.</p></div><div class="about-photo page-hero-media"><img src="/assets/hero-accountant.png" alt="Asesor revisando información financiera" /></div></section>
      <section class="corporate-section about-story about-story-followup"><div><span class="public-eyebrow">NUESTRA FIRMA</span><h2>La rigurosidad que necesita, con la cercanía que espera.</h2></div><div><p>Organizamos su información para anticipar escenarios, proteger el cumplimiento y sostener el crecimiento. Nuestro acompañamiento combina procesos ordenados, actualización permanente y una comunicación directa.</p><button class="gold-button" data-public-page="contact">Solicitar una reunión</button></div></section>
      <section class="corporate-section values-section"><div class="section-heading centered"><span class="public-eyebrow">NUESTROS PRINCIPIOS</span><h2>Una relación basada en confianza.</h2></div><div class="values-grid"><article><b>01</b><h3>Rigor técnico</h3><p>Aplicamos la normativa con precisión y criterio profesional.</p></article><article><b>02</b><h3>Visión de negocio</h3><p>Traducimos los números a decisiones accionables.</p></article><article><b>03</b><h3>Comunicación cercana</h3><p>Respondemos con claridad, oportunidad y lenguaje simple.</p></article><article><b>04</b><h3>Mejora continua</h3><p>Actualizamos procesos y herramientas para servir mejor.</p></article></div></section>
      <section class="corporate-section methodology"><div><span class="public-eyebrow">METODOLOGÍA</span><h2>Orden, seguimiento y resultados visibles.</h2></div><ol><li><span>1</span><div><b>Diagnóstico</b><p>Entendemos su operación, riesgos y objetivos.</p></div></li><li><span>2</span><div><b>Plan de trabajo</b><p>Definimos entregables, responsables y prioridades.</p></div></li><li><span>3</span><div><b>Acompañamiento</b><p>Ejecutamos y comunicamos avances de forma periódica.</p></div></li><li><span>4</span><div><b>Decisión</b><p>Entregamos información clara para gestionar mejor.</p></div></li></ol></section>
    </main>`;
  }

  function servicesPage() { return `<main>${pageHead("SERVICIOS", "Todo lo que su empresa necesita, en un solo estudio.", "Un portafolio integral diseñado para acompañarle desde la formalización hasta la consolidación financiera.")}
    <section class="corporate-banner services-banner" aria-label="Soluciones contables y financieras"><img src="/assets/services-banner.png" alt="Ilustración de soluciones contables y financieras" /><div class="corporate-banner-copy"><span class="public-eyebrow">VISIÓN DE NEGOCIO</span><h2>Ordenamos sus números para que avance con claridad.</h2><p>Información confiable para cumplir, planificar y tomar mejores decisiones.</p></div></section>
    <section class="corporate-section services-catalog-section"><div class="service-catalog">${serviceCards()}</div></section>
    <section class="corporate-section service-cta"><div><span class="public-eyebrow">¿NO SABE POR DÓNDE EMPEZAR?</span><h2>Cuéntenos su situación y le orientamos.</h2><p>Una conversación inicial nos permite recomendarle el servicio que más valor puede aportar a su empresa.</p></div><button class="gold-button" data-public-page="contact">Solicitar asesoría</button></section>
  </main>`; }

  function team() { return `<main class="public-page public-page-team">
    <section class="corporate-section founder-section page-hero page-hero-team"><div class="founder-image page-hero-media"><img src="/assets/founder-jimm.png" alt="CPC. Jimm Kenny Nolasco Cotrina" /><span>CONTADOR A CARGO</span></div><div class="page-hero-copy"><span class="public-eyebrow">NUESTRO EQUIPO</span><h1>Profesionales que entienden su negocio</h1><h3>CPC. Jimm Kenny Nolasco Cotrina · Contador a cargo</h3><p>Con más de 15 años de experiencia, acompaña a empresas con una visión técnica, cercana y enfocada en decisiones financieras mejor informadas.</p><p>Su enfoque combina precisión contable, prevención de riesgos tributarios y orden en cada proceso de gestión.</p></div></section>
    <section class="corporate-section"><div class="section-heading centered"><span class="public-eyebrow">ESPECIALISTAS</span><h2>Conocimiento que se complementa.</h2></div><div class="people-grid"><article><img src="/assets/team-maria.png" alt="María Álvarez" /><h3>María Álvarez</h3><span>GERENTE CONTABLE</span><p>NIIF · Estados Financieros · Control de gestión</p></article><article><img src="/assets/team-jorge.png" alt="Jorge Rivera" /><h3>Jorge Rivera</h3><span>ASESOR TRIBUTARIO</span><p>PDT · Fiscalizaciones · SUNAT</p></article><article><img src="/assets/team-carla.png" alt="Carla Mendoza" /><h3>Carla Mendoza</h3><span>CONSULTORA LABORAL</span><p>Planillas · Recursos Humanos · Relaciones laborales</p></article></div></section>
  </main>`; }

  function contact(selectedService) { return `<main class="public-page public-page-contact"><section class="page-heading contact-page-heading"><span class="public-eyebrow">CONTACTO</span><h1>Conversemos sobre su empresa</h1><p>Complete el formulario y un asesor de Estudio Contable JK le contactará en menos de 24 horas.</p></section>
    <section class="corporate-banner contact-banner" aria-label="Canales de contacto de JK Asesores Contables"><img src="/assets/contact-banner.png" alt="Canales de contacto de JK Asesores Contables" /><div class="corporate-banner-copy"><span class="public-eyebrow">ATENCIÓN CERCANA</span><h2>Estamos listos para escucharle.</h2><p>Cuéntenos qué necesita y le ayudaremos a encontrar el siguiente paso.</p></div></section>
    <section class="corporate-section contact-layout"><form id="corporate-contact-form" class="corporate-form"><div class="form-grid"><label>Nombre completo<input required name="name" placeholder="Ej. María Pérez" /></label><label>Correo<input required type="email" name="email" placeholder="correo@empresa.com" /></label><label>Teléfono<input name="phone" placeholder="+51 999 000 000" /></label><label>Empresa<input name="company" placeholder="Razón social" /></label></div><label>Servicio de interés<input id="contact-service" name="service" value="${selectedService || ""}" placeholder="Seleccione o describa el servicio" /></label><label>Mensaje<textarea required name="message" rows="6" placeholder="Cuéntenos brevemente su necesidad"></textarea></label><button class="gold-button" type="submit">✈ Enviar mensaje</button><p class="form-feedback" aria-live="polite"></p></form><aside class="contact-details"><a href="https://maps.google.com/?q=JR.+CHILE+MZ.+A+LT.+7,+SAN+LUIS,+AMARILIS,+HUANUCO" target="_blank" rel="noreferrer"><span>⌖</span><div><small>DIRECCIÓN</small><b>JR. CHILE MZ. A LT. 7, San Luis — Amarilis, Huánuco</b></div></a><a href="mailto:jk.asesorescontables17@gmail.com"><span>✉</span><div><small>CORREO</small><b>jk.asesorescontables17@gmail.com</b></div></a><a href="tel:+51950361967"><span>☎</span><div><small>TELÉFONO</small><b>950 361 967</b></div></a><a href="https://wa.me/51950361967" target="_blank" rel="noreferrer"><span class="whatsapp-inline">${whatsappIcon("whatsapp-logo-image")}</span><div><small>WHATSAPP</small><b>+51 950 361 967</b></div></a><div><span>◷</span><div><small>HORARIO</small><b>Lun a Vie · 9:00 a 18:00 · Sáb 9:00 a 13:00</b></div></div></aside></section>
  </main>`; }

  function enableMotion(scope = document) {
    const site = scope.querySelector?.(".corporate-site") || document.querySelector(".corporate-site");
    if (!site || !window.IntersectionObserver) return;
    const nodes = site.querySelectorAll(".corporate-section > *, .service-catalog-card, .values-grid article, .people-grid article, .contact-details > *, .corporate-form");
    site.classList.add("js-motion");
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: .13 });
    nodes.forEach((node) => { node.classList.add("reveal-on-scroll"); observer.observe(node); });
    const counters = site.querySelectorAll("[data-counter]");
    const animateCounter = (node) => {
      const target = Number(node.dataset.counter || 0);
      const suffix = node.dataset.counterSuffix || "";
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
        node.textContent = `${target}${suffix}`;
        return;
      }
      const start = performance.now();
      const duration = 850;
      node.classList.add("is-counting");
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
        else window.setTimeout(() => node.classList.remove("is-counting"), 180);
      };
      requestAnimationFrame(tick);
    };
    if (counters.length) {
      const counterObserver = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          currentObserver.unobserve(entry.target);
        });
      }, { threshold: .45 });
      counters.forEach((counter) => counterObserver.observe(counter));
    }
  }

  function openServiceSummary(title) {
    const description = serviceSummaries[title] || "Le orientamos sobre este servicio y preparamos una propuesta según las necesidades de su empresa.";
    document.querySelector(".service-summary-modal")?.remove();
    const modal = document.createElement("div");
    modal.className = "service-summary-modal";
    modal.innerHTML = `<div class="service-summary-backdrop" data-close-service-summary></div><section class="service-summary-dialog" role="dialog" aria-modal="true" aria-labelledby="service-summary-title"><button class="service-summary-close" type="button" data-close-service-summary aria-label="Cerrar resumen">×</button><span class="public-eyebrow">SERVICIO ESPECIALIZADO</span><h2 id="service-summary-title">${title}</h2><p>${description}</p><div class="service-summary-actions"><button class="secondary-button" type="button" data-close-service-summary>Seguir explorando</button><button class="gold-button" type="button" data-service-quote="${title}">Cotizar este servicio</button></div></section>`;
    document.body.append(modal);
    modal.querySelector(".service-summary-close")?.focus();
  }

  function view(page, selectedService) {
    const safePage = ["home", "about", "services", "team", "contact"].includes(page) ? page : "home";
    const content = { home: home(), about: about(), services: servicesPage(), team: team(), contact: contact(selectedService) }[safePage];
    const flyer = safePage === "home" ? `<div class="site-flyer" role="dialog" aria-modal="true" aria-label="Información destacada"><div class="site-flyer-backdrop" data-close-flyer></div><section class="site-flyer-card"><button class="site-flyer-close" type="button" data-close-flyer aria-label="Cerrar flyer">×</button><img src="/assets/logistica-flyer.jpeg" alt="Soluciones empresariales y gestión estratégica"><div class="site-flyer-copy"><span class="public-eyebrow">JK ASESORES CONTABLES</span><h2>Información clara para mover su empresa.</h2><p>Contabilidad, tributación y gestión con el respaldo que su negocio necesita.</p><button class="gold-button" data-close-flyer>Continuar al sitio</button></div></section></div>` : "";
    return `<div class="public-site corporate-site">${nav(safePage)}${content}${footer()}${flyer}</div>`;
  }

  window.JKCorporate = { view, enableMotion, openServiceSummary };
})();
