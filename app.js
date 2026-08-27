import { auth } from "./js/auth.js";
import { supabase } from "./js/supabase-client.js";
import { sampleCompanies, sampleDocuments } from "./js/data.js";
import { storage } from "./js/storage.js";
import { parseSunatXml } from "./js/xml-parser.js";
import { downloadFeePdf, downloadPayrollPdf, money, previewFeePdf, previewPayrollPdf } from "./js/templates.js";
import { defaultFeeGreeting, feeFilename, feeTotal, validFeeItems } from "./js/fees.js";

const root = document.getElementById("vanilla-app");
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const initials = (value) => escapeHtml(String(value || "JK").slice(0, 2));
const logoSource = (value) => { const source = String(value || "").trim(); return source && !["sin-logo", "__sin_logo__"].includes(source) ? source : ""; };
const cachedLogoSource = (value) => /^data:image\//i.test(String(value || "").trim()) ? String(value).trim() : "";
const state = { mode: "public", authMode: "login", view: "dashboard", session: auth.getSession(), companies: storage.companies(sampleCompanies).map((company) => ({ ...company, logoData: cachedLogoSource(company.logoData) })), documents: storage.documents(sampleDocuments), messages: storage.messages([]), messageFeedback: "", payroll: null, payrollFile: "", selectedCompany: "", feeItems: [{ id: "fee-1", description: "", amount: 0 }], feeDate: new Date().toISOString().slice(0, 10), greeting: "", observations: "", editingCompany: null };
if (state.session) state.mode = state.session.role === "admin" ? "admin" : "client";
const study = { phone: "950 361 967", email: "contacto@estudiojk.com.pe", address: "Chile, Amarilis 00011" };

function render() { root.innerHTML = state.mode === "public" ? corporatePublicView() : state.mode === "auth" ? authView() : state.mode === "client" ? clientView() : adminView(); bind(); if (state.mode === "public") requestAnimationFrame(() => window.JKCorporate?.enableMotion?.(root)); }
function publicView() { return `<div class="public-site"><header class="public-nav"><a class="public-brand" href="#inicio" data-scroll="inicio"><span class="public-brand-mark">JK</span><span><b>Estudio JK</b><small>CONTABLE · TRIBUTARIO</small></span></a><button class="mobile-toggle" data-action="mobile" aria-label="Abrir navegación">☰</button><nav class="public-links"><button class="active" data-scroll="inicio">Inicio</button><button data-scroll="nosotros">Nosotros</button><button data-scroll="servicios">Servicios</button><button data-scroll="equipo">Equipo</button><button data-scroll="contacto">Contacto</button></nav><div class="public-actions"><button class="login-link" data-action="login">↪ <span>Iniciar sesión</span></button><button class="gold-button public-register" data-action="register">♙ <span>Registrarse</span></button></div></header><main><section id="inicio" class="hero-section"><div class="hero-image" aria-hidden="true"></div><div class="hero-overlay"></div><div class="hero-content"><span class="hero-kicker">✣ ESTUDIO CONTABLE PREMIUM</span><h1>Precisión contable con la <em>confianza</em> que su empresa merece.</h1><p>En Estudio JK integramos experiencia, tecnología y una vocación de servicio impecable para gestionar la contabilidad, tributación y planeamiento financiero de su negocio.</p><div class="hero-actions"><button class="gold-button" data-scroll="contacto">Solicitar asesoría</button><button class="outline-light" data-scroll="contacto">Contáctanos</button></div></div><button class="scroll-cue" data-scroll="nosotros" aria-label="Conocer el estudio">⌄</button></section><div class="trust-strip"><span>Con la precisión que su negocio necesita</span><div><b>CHÁVEZ</b><b>INVERSIONES ANDINAS</b><b>GRUPO TAMBO</b><b>ANDINOS</b></div></div><section id="nosotros" class="public-section about-section"><div class="about-art"><span class="art-card art-card-main">JK</span><span class="art-card art-card-note">20+<small>AÑOS DE EXPERIENCIA</small></span><span class="art-line"></span></div><div class="section-copy"><span class="public-eyebrow">NUESTRA FIRMA</span><h2>Un socio estratégico para cada etapa de su empresa.</h2><p>Somos un estudio contable peruano que acompaña a empresarios y organizaciones con información confiable, criterio técnico y una mirada práctica del negocio.</p><p>Trabajamos para que la complejidad contable y tributaria deje de ser una preocupación y se convierta en una ventaja para decidir mejor.</p><button class="arrow-link" data-scroll="contacto">Conozca cómo podemos ayudarle <span>→</span></button></div></section><section id="servicios" class="public-section services-section"><div class="section-heading centered"><span class="public-eyebrow">LO QUE HACEMOS</span><h2>Soluciones con visión de negocio.</h2><p>Un equipo multidisciplinario, procesos ordenados y tecnología al servicio de sus decisiones.</p></div><div class="service-grid">${[["▦","Contabilidad integral","Información financiera ordenada y oportuna para tomar decisiones con confianza."],["◈","Tributación estratégica","Cumplimiento, prevención y planificación tributaria para proteger el crecimiento de su negocio."],["⌁","Planeamiento financiero","Convertimos sus números en una ruta clara para mejorar rentabilidad y liquidez."],["◎","Gestión laboral","Planillas, beneficios sociales y soporte laboral con precisión y respaldo profesional."]].map(([icon,title,text]) => `<article class="service-card"><span class="service-icon">${icon}</span><h3>${title}</h3><p>${text}</p><a href="#contacto" data-scroll="contacto">Conocer servicio <span>↗</span></a></article>`).join("")}</div></section><section id="equipo" class="public-section team-section"><div class="section-heading"><span class="public-eyebrow">NUESTRO EQUIPO</span><h2>Experiencia que se nota en cada detalle.</h2><p>Profesionales cercanos, rigurosos y comprometidos con los resultados de nuestros clientes.</p></div><div class="team-grid">${[["CPC. Javier Kohatsu Rojas","Fundador · Contador Público Colegiado","Dirección estratégica, tributación y planeamiento financiero."],["María Álvarez","Gerente contable","NIIF · Estados financieros · Control de gestión"],["Jorge Rivera","Asesor tributario","PDT · Fiscalizaciones · SUNAT"]].map((item,index) => `<article class="team-card team-card-${index}"><div class="team-avatar">${initials(item[0])}</div><div><h3>${item[0]}</h3><span>${item[1]}</span><p>${item[2]}</p></div></article>`).join("")}</div></section><section class="quote-section"><span class="quote-mark">“</span><blockquote>El nivel de detalle y proactividad del Estudio JK cambió nuestra gestión. Hoy tomamos decisiones con información en tiempo real.</blockquote><cite>Ronald Chávez · Gerente General, Corporación Chávez</cite></section><section id="contacto" class="contact-section"><div><span class="public-eyebrow">HABLEMOS DE SU EMPRESA</span><h2>El siguiente paso empieza con una conversación.</h2><p>Cuéntenos qué necesita. Le responderemos con una ruta clara y concreta.</p></div><div class="contact-card"><a href="tel:+51950361967"><small>LLÁMENOS</small><b>${study.phone}</b></a><a href="mailto:${study.email}"><small>ESCRÍBANOS</small><b>${study.email}</b></a><a href="https://wa.me/51950361967" target="_blank" class="contact-cta">Solicitar asesoría <span>→</span></a></div></section></main><footer class="public-footer"><div class="public-brand"><span class="public-brand-mark">JK</span><span><b>Estudio JK</b><small>CONTABLE · TRIBUTARIO</small></span></div><span>© 2026 Estudio Contable JK. Todos los derechos reservados.</span><div><button data-action="login">Panel administrativo</button><a href="mailto:${study.email}">Contacto</a></div></footer><a class="whatsapp-float" href="https://wa.me/51950361967" target="_blank" aria-label="Contactar por WhatsApp">◔</a></div>`; }
function authView() { const register = state.authMode === "register"; return `<div class="auth-shell"><div class="auth-visual"><div class="auth-visual-overlay"></div><button class="auth-back" data-action="public">← Volver al sitio</button><div class="auth-visual-copy"><span class="hero-kicker">✣ ESTUDIO CONTABLE PREMIUM</span><h1>La tranquilidad de tener sus números en buenas manos.</h1><p>Acceda a su espacio de trabajo seguro y mantenga sus documentos al alcance.</p></div><span class="auth-visual-sign">JK ASESORES CONTABLES</span></div><div class="auth-panel"><div class="auth-brand"><img class="corporate-logo auth-corporate-logo" src="/assets/contenido/jk-logo.png" alt="JK Asesores Contables"></div><div class="auth-heading"><span class="public-eyebrow">${register ? "NUEVO CLIENTE" : "ÁREA PRIVADA"}</span><h2>${register ? "Cree su cuenta" : "Bienvenido de nuevo"}</h2><p>${register ? "Regístrese para solicitar asesoría y acceder a sus documentos." : "Ingrese sus credenciales para acceder a su espacio de trabajo."}</p></div><form id="auth-form" class="auth-form">${register ? `<label>Nombre completo<input required name="name" placeholder="Su nombre"></label><label>Empresa<input required name="company" placeholder="Razón social"></label><label>Fecha de nacimiento<input required type="date" name="birthDate" max="${new Date().toISOString().slice(0, 10)}"></label>` : ""}<label>Correo electrónico<input required type="email" name="email" placeholder="nombre@empresa.com"></label><label>Contraseña<input required type="password" name="password" placeholder="${register ? "Mínimo 6 caracteres" : "Su contraseña"}"></label>${!register ? `<div class="auth-options"><label class="check-label"><input type="checkbox"> Recordarme</label><button type="button">¿Olvidó su contraseña?</button></div>` : ""}<div id="auth-error"></div><button class="gold-button auth-submit">${register ? "Crear cuenta" : "Iniciar sesión"} <span>→</span></button></form>${!register ? `<div class="demo-access"><b>Acceso administrador local</b><span>admin@estudiojk.com.pe · contraseña: 12345</span></div>` : ""}<p class="auth-switch">${register ? "¿Ya tiene una cuenta?" : "¿Aún no tiene una cuenta?"} <button data-action="switch-auth">${register ? "Iniciar sesión" : "Registrarse"}</button></p><small class="auth-legal">Al continuar acepta nuestros términos de servicio y política de privacidad.</small></div></div>`; }
function clientView() { const company = state.companies.find((item) => item.name.toLowerCase().includes((state.session.company || "").toLowerCase())) || state.companies[0]; return `<div class="client-portal"><header class="client-nav"><div class="public-brand"><span class="public-brand-mark">JK</span><span><b>Estudio JK</b><small>ESPACIO DEL CLIENTE</small></span></div><div class="client-user"><span>${initials(state.session.name).slice(0,1)}</span><div><b>${escapeHtml(state.session.name)}</b><small>${escapeHtml(state.session.email)}</small></div><button data-action="logout">Salir</button></div></header><main class="client-main"><div class="client-welcome"><span class="public-eyebrow">ESPACIO DEL CLIENTE</span><h1>Hola, ${escapeHtml(state.session.name.split(" ")[0])}.</h1><p>Su información y documentos, ordenados y disponibles cuando los necesite.</p></div><div class="client-grid"><section class="client-card client-company"><span class="service-icon">▥</span><small>EMPRESA ASOCIADA</small><h2>${escapeHtml(company?.name || state.session.company || "Su empresa")}</h2><p>${company?.ruc ? `RUC ${company.ruc}` : "Estamos configurando su espacio."}</p><button class="arrow-link">Ver información <span>→</span></button></section><section class="client-card"><div class="client-card-heading"><div><small>DOCUMENTOS RECIENTES</small><h2>${state.documents.length} archivos</h2></div><span class="service-icon">◫</span></div>${state.documents.slice(0,3).map((doc) => `<div class="client-document"><span>${doc.type === "boleta" ? "B" : "H"}</span><div><b>${escapeHtml(doc.title)}</b><small>${escapeHtml(doc.companyName)}</small></div><button>↓</button></div>`).join("") || `<p class="empty-state">Su asesor cargará aquí los documentos generados.</p>`}</section></div><section class="client-help"><div><span class="public-eyebrow">¿NECESITA AYUDA?</span><h2>Estamos para acompañarlo.</h2><p>Comuníquese con nuestro equipo para solicitar información o asistencia.</p></div><a class="gold-button" href="https://wa.me/51950361967" target="_blank">Contactar al estudio →</a></section></main></div>`; }
function adminView() { return `<div class="app-shell"><aside class="sidebar"><div class="brand"><span class="brand-mark">JK</span><div><b>Estudio JK</b><small>PANEL ADMIN</small></div></div><div class="side-group"><span class="side-label">GESTIÓN</span>${[["dashboard","▦","Dashboard"],["companies","▥","Empresas"],["history","◫","Historial de archivos"]].map(([view,icon,label]) => `<button class="side-link ${state.view === view ? "active" : ""}" data-view="${view}"><span>${icon}</span>${label}</button>`).join("")}</div><div class="side-group automation"><span class="side-label">AUTOMATIZACIÓN</span><button class="side-link ${state.view === "templates" ? "active" : ""}" data-view="templates"><span>↥</span>Generar plantillas</button><button class="side-link ${state.view === "fees" ? "active" : ""}" data-view="fees"><span>▣</span>Generar honorarios</button></div><div class="sidebar-spacer"></div><div class="side-user"><span class="avatar">J</span><div><b>${escapeHtml(state.session.name)}</b><small>${escapeHtml(state.session.email)}</small></div></div><button class="logout" data-action="logout">↪ <span>Cerrar sesión</span></button></aside><div class="main-shell"><header class="topbar"><button class="menu-button" data-action="menu">☰</button><span class="topbar-rule"></span><span class="topbar-title">Panel administrativo</span><div class="topbar-spacer"></div><span class="status-dot"></span><span class="topbar-status">Modo local preparado para Supabase</span></header><main>${state.view === "dashboard" ? dashboardView() : state.view === "companies" ? companiesView() : state.view === "templates" ? templatesView() : state.view === "fees" ? feesView() : historyView()}</main></div></div>`; }
function dashboardView() { const active = state.companies.filter((item) => item.active).length; return `<div class="page"><div class="page-heading"><div><span class="eyebrow">RESUMEN OPERATIVO</span><h1>Dashboard</h1><p>Una vista clara del estudio, sus empresas y archivos generados.</p></div><button class="gold-button" data-view="templates">＋ Nueva generación</button></div><div class="metrics"><div class="metric-card"><span class="metric-icon">▥</span><strong>${active}<small> / ${state.companies.length}</small></strong><span>EMPRESAS ACTIVAS</span></div><div class="metric-card"><span class="metric-icon">♙</span><strong>${storage.users([]).filter((user) => user.role !== "admin").length}</strong><span>USUARIOS REGISTRADOS</span></div><div class="metric-card"><span class="metric-icon">◫</span><strong>${state.documents.length}</strong><span>DOCUMENTOS GENERADOS</span></div><div class="metric-card"><span class="metric-icon">⌁</span><strong>${state.documents.length + 1}</strong><span>ACTIVIDAD RECIENTE</span></div></div><div class="dashboard-grid"><section class="panel activity-panel"><div class="panel-heading"><div><span class="eyebrow">TRAZABILIDAD</span><h2>Actividad reciente</h2></div><button class="text-button" data-view="history">Ver historial →</button></div><div class="activity-list">${state.documents.slice(0,4).map((doc) => `<button class="activity-row" data-view="history"><span class="file-icon ${doc.type}">${doc.type === "boleta" ? "B" : "H"}</span><span><b>${escapeHtml(doc.title)}</b><small>${escapeHtml(doc.companyName)} · ${doc.type === "boleta" ? "Boleta" : "Honorarios"}</small></span><time>reciente</time><span class="row-arrow">→</span></button>`).join("")}</div></section><section class="panel quick-panel"><span class="eyebrow">ACCESOS RÁPIDOS</span><h2>Continúa tu trabajo</h2><button class="quick-action" data-view="templates"><span>↥</span><div><b>Generar boleta PLAME</b><small>Sube un XML de SUNAT y descarga el PDF</small></div><i>→</i></button><button class="quick-action" data-view="fees"><span>▣</span><div><b>Generar honorarios</b><small>Crea un recibo con múltiples conceptos</small></div><i>→</i></button><button class="quick-action" data-view="companies"><span>＋</span><div><b>Registrar empresa</b><small>Guarda identidad, logo y contactos</small></div><i>→</i></button><button class="quick-action" data-view="messages"><span>✉</span><div><b>Mensajería</b><small>Envía avisos a uno o todos los usuarios</small></div><i>→</i></button></section></div></div>`; }
function companiesView() { return `<div class="page"><div class="page-heading"><div><span class="eyebrow">GESTIÓN DE CLIENTES</span><h1>Empresas</h1><p>Gestione las empresas y la identidad que aparecerá en sus documentos.</p></div><button class="gold-button" data-action="new-company">＋ Nueva empresa</button></div><div class="search-box"><span>⌕</span><input id="company-search" placeholder="Buscar por razón social, RUC o representante..."></div><section class="panel table-panel"><div class="table-header"><span>EMPRESA</span><span>RUC</span><span>REPRESENTANTE</span><span>ESTADO</span><span>ACCIONES</span></div>${state.companies.map((company) => `<div class="company-row"><div class="company-name"><span class="company-avatar" style="background:${company.color}">${company.logoData ? `<img src="${company.logoData}" alt="">` : initials(company.name)}</span><span><b>${escapeHtml(company.name)}</b><small>${escapeHtml(company.email)}</small></span></div><span>${company.ruc}</span><span>${escapeHtml(company.representative)}</span><i class="pill ${company.active ? "active" : ""}">● ${company.active ? "Activa" : "Inactiva"}</i><span class="actions"><button data-edit-company="${company.id}">✎</button><button class="danger" data-delete-company="${company.id}">♧</button></span></div>`).join("")}</section></div>`; }
function templatesView() { const active = state.companies.filter((item) => item.active); return `<div class="page"><div class="page-heading"><div><span class="eyebrow">AUTOMATIZACIÓN · PLAME R08</span><h1>Generar plantillas</h1><p>Suba un XML exportado desde SUNAT y cree una boleta profesional con la identidad de la empresa.</p></div><span class="ready-badge"><i></i> Motor JavaScript activo</span></div><div class="generator-layout"><section class="panel generator-card"><div class="step-heading"><span>1</span><div><h2>Cargar XML de SUNAT</h2><p>Leemos la hoja real <b>SUNAT-PDT</b> sin asumir campos.</p></div></div><label class="dropzone ${state.payroll ? "has-file" : ""}"><input type="file" id="xml-file" accept=".xml,text/xml">${state.payroll ? `<span class="success-icon">✓</span><b>${escapeHtml(state.payrollFile)}</b><small>XML procesado correctamente · ${escapeHtml(state.payroll.employee)}</small>` : `<span class="upload-icon">↥</span><b>Haz clic para subir o arrastra el archivo</b><small>Formato .xml · PLAME R08</small>`}</label>${state.payroll ? `<div class="parsed-summary"><span><b>RUC</b>${state.payroll.ruc}</span><span><b>Periodo</b>${state.payroll.period}</span><span><b>Ingresos</b>${state.payroll.incomes.length}</span><span><b>Neto</b>${money(state.payroll.net)}</span></div>` : ""}</section><section class="panel generator-card"><div class="step-heading"><span>2</span><div><h2>Seleccionar empresa</h2><p>El logo y los datos saldrán de la empresa elegida.</p></div></div><label>Empresa emisora<select id="template-company"><option value="">Selecciona una empresa…</option>${active.map((company) => `<option value="${company.id}" ${state.selectedCompany === company.id ? "selected" : ""}>${escapeHtml(company.name)} · ${company.ruc}</option>`).join("")}</select></label>${state.selectedCompany ? `<div class="selected-company"><span class="company-avatar" style="background:${active.find((item) => item.id === state.selectedCompany)?.color}">${initials(active.find((item) => item.id === state.selectedCompany)?.name)}</span><span><b>${escapeHtml(active.find((item) => item.id === state.selectedCompany)?.name)}</b><small>Logo y datos listos para la plantilla.</small></span><span class="check">✓</span></div>` : ""}<div class="document-fields"><span><b>Incluye</b>Trabajador, régimen, conceptos, ingresos, descuentos, aportes y neto.</span><span><b>Identidad</b>Logo, dirección, teléfono y correo de la empresa.</span></div></section></div><div class="generator-actions"><button class="secondary-button" data-action="preview-payroll" ${!state.payroll || !state.selectedCompany ? "disabled" : ""}>◉ Vista previa</button><button class="gold-button" data-action="download-payroll" ${!state.payroll || !state.selectedCompany ? "disabled" : ""}>↓ Descargar PDF</button><button class="text-button" data-action="reset-payroll">↻ Reiniciar</button>${(!state.payroll || !state.selectedCompany) ? `<span class="action-hint">Suba un XML y seleccione una empresa para habilitar las acciones.</span>` : ""}</div></div>`; }
function feesView() { const total = state.feeItems.reduce((sum, item) => sum + Number(item.amount || 0), 0); const company = state.companies.find((item) => item.id === state.selectedCompany); return `<div class="page"><div class="page-heading"><div><span class="eyebrow">AUTOMATIZACIÓN · SERVICIOS</span><h1>Generar honorarios</h1><p>Un recibo elegante con carta institucional, múltiples conceptos y cálculo automático.</p></div><span class="ready-badge"><i></i> Plantilla JavaScript</span></div><div class="generator-layout fee-layout"><section class="panel form-panel"><div class="section-title"><span class="metric-icon small">▣</span><div><h2>Datos del recibo</h2><p>Complete los datos que aparecerán en la plantilla descargable.</p></div></div><label>Empresa cliente<select id="fee-company"><option value="">Selecciona una empresa…</option>${state.companies.filter((item) => item.active).map((item) => `<option value="${item.id}" ${state.selectedCompany === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select></label><label>Fecha<input id="fee-date" type="date" value="${state.feeDate}"></label><div class="items-heading"><label>Conceptos y montos</label><button class="small-button" data-action="add-fee">＋ Agregar</button></div><div class="fee-items">${state.feeItems.map((item,index) => `<div class="fee-item"><span class="item-number">${index + 1}</span><input data-fee-description="${item.id}" placeholder="Ej. Contabilidad mensual" value="${escapeHtml(item.description)}"><input data-fee-amount="${item.id}" type="number" min="0" step="0.01" placeholder="0.00" value="${item.amount || ""}"><button class="delete-row" data-remove-fee="${item.id}" aria-label="Eliminar concepto">×</button></div>`).join("")}</div><label>Texto de saludo / solicitud <small>Opcional</small><textarea id="fee-greeting" placeholder="Se genera automáticamente al elegir la empresa...">${escapeHtml(state.greeting)}</textarea></label><label>Observaciones <small>Opcional</small><textarea id="fee-observations" placeholder="Notas adicionales...">${escapeHtml(state.observations)}</textarea></label><div class="form-footer"><div class="total-inline"><span>Total calculado</span><b>${money(total)}</b></div><div class="generator-actions compact"><button class="secondary-button" data-action="preview-fee" ${!company ? "disabled" : ""}>◉ Vista previa</button><button class="gold-button" data-action="download-fee" ${!company ? "disabled" : ""}>↓ Generar y descargar</button></div></div></section><section class="panel live-preview"><span class="eyebrow">PREVISUALIZACIÓN EN VIVO</span><h2>Recibo por honorarios</h2><div class="mini-document"><div class="mini-head"><span class="mini-logo" style="background:${company?.color || "#b49141"}">${initials(company?.name || "JK")}</span><span><b>${escapeHtml(company?.name || "Selecciona una empresa")}</b><small>${company?.ruc || "RUC pendiente"}</small></span></div><div class="mini-divider"></div><b>“Año de la Esperanza y el Fortalecimiento de la Democracia”</b>${state.feeItems.map((item,index) => `<div class="mini-row"><span>${index + 1}. ${escapeHtml(item.description || "Concepto pendiente")}</span><b>${money(item.amount)}</b></div>`).join("")}<div class="mini-total"><span>TOTAL A PAGAR</span><b>${money(total)}</b></div></div></section></div></div>`; }
function historyView() { return `<div class="page"><div class="page-heading"><div><span class="eyebrow">TRAZABILIDAD</span><h1>Historial de archivos</h1><p>Acceda nuevamente a los documentos generados o elimínelos cuando ya no los necesite.</p></div><div class="history-count"><b>${state.documents.length}</b><span>documentos</span></div></div><section class="panel history-panel"><div class="history-header"><span>DOCUMENTO</span><span>EMPRESA</span><span>TIPO</span><span>IMPORTE</span><span>ACCIONES</span></div>${state.documents.map((doc) => `<div class="history-row"><div class="history-doc"><span class="file-icon ${doc.type}">${doc.type === "boleta" ? "B" : "H"}</span><span><strong>${escapeHtml(doc.title)}</strong><small>${new Date(doc.createdAt).toLocaleDateString("es-PE")}</small></span></div><span>${escapeHtml(doc.companyName)}</span><span>${doc.type === "boleta" ? "Boleta" : "Honorarios"}</span><span>${money(doc.amount)}</span><span class="actions"><button data-download-doc="${doc.id}">↓</button><button class="danger" data-delete-doc="${doc.id}">♧</button></span></div>`).join("") || `<div class="empty-state large">Todavía no hay documentos generados.</div>`}</section></div>`; }

function bind() { root.querySelectorAll("[data-scroll]").forEach((item) => item.addEventListener("click", (event) => { event.preventDefault(); document.getElementById(item.dataset.scroll)?.scrollIntoView({ behavior: "smooth" }); root.querySelector(".public-links")?.classList.remove("is-open"); })); root.querySelectorAll("[data-action]").forEach((item) => item.addEventListener("click", () => action(item.dataset.action))); root.querySelectorAll("[data-view]").forEach((item) => item.addEventListener("click", () => { state.view = item.dataset.view; render(); })); const authForm = document.getElementById("auth-form"); if (authForm) authForm.addEventListener("submit", submitAuth); const xml = document.getElementById("xml-file"); if (xml) xml.addEventListener("change", readXml); const templateCompany = document.getElementById("template-company"); if (templateCompany) templateCompany.addEventListener("change", () => { state.selectedCompany = templateCompany.value; render(); }); const feeCompany = document.getElementById("fee-company"); if (feeCompany) feeCompany.addEventListener("change", () => { state.selectedCompany = feeCompany.value; render(); }); root.querySelectorAll("[data-fee-description]").forEach((input) => input.addEventListener("input", () => { const item = state.feeItems.find((fee) => fee.id === input.dataset.feeDescription); if (item) item.description = input.value; })); root.querySelectorAll("[data-fee-amount]").forEach((input) => input.addEventListener("input", () => { const item = state.feeItems.find((fee) => fee.id === input.dataset.feeAmount); if (item) item.amount = Number(input.value); })); root.querySelectorAll("[data-remove-fee]").forEach((item) => item.addEventListener("click", () => { if (state.feeItems.length > 1) state.feeItems = state.feeItems.filter((fee) => fee.id !== item.dataset.removeFee); render(); })); root.querySelectorAll("[data-delete-doc]").forEach((item) => item.addEventListener("click", () => { if (confirm("¿Eliminar este archivo del historial?")) { state.documents = state.documents.filter((doc) => doc.id !== item.dataset.deleteDoc); storage.saveDocuments(state.documents); render(); } })); root.querySelectorAll("[data-download-doc]").forEach((item) => item.addEventListener("click", () => { const doc = state.documents.find((entry) => entry.id === item.dataset.downloadDoc); if (doc && doc.payload?.payroll) openPrint(payrollDocument(state.companies.find((company) => company.id === doc.companyId), doc.payload.payroll), doc.title); if (doc && doc.payload?.fee) openPrint(feeDocument(state.companies.find((company) => company.id === doc.companyId), doc.payload.fee), doc.title); })); root.querySelectorAll("[data-edit-company]").forEach((item) => item.addEventListener("click", () => { state.editingCompany = state.companies.find((company) => company.id === item.dataset.editCompany); renderCompanyModal(); })); root.querySelectorAll("[data-delete-company]").forEach((item) => item.addEventListener("click", () => { if (confirm("¿Eliminar esta empresa?")) { state.companies = state.companies.filter((company) => company.id !== item.dataset.deleteCompany); storage.saveCompanies(state.companies); render(); } })); }
function action(type) { if (type === "login") { state.authMode = "login"; state.mode = "auth"; render(); } if (type === "register") { state.authMode = "register"; state.mode = "auth"; render(); } if (type === "switch-auth") { state.authMode = state.authMode === "login" ? "register" : "login"; render(); } if (type === "public") { state.mode = "public"; render(); } if (type === "logout") { auth.logout(); state.session = null; state.mode = "public"; render(); } if (type === "mobile") root.querySelector(".public-links")?.classList.toggle("is-open"); if (type === "menu") root.querySelector(".sidebar")?.classList.toggle("is-open"); if (type === "new-company") renderCompanyModal(); if (type === "add-fee") { state.feeItems.push({ id: `fee-${Date.now()}`, description: "", amount: 0 }); render(); } if (type === "reset-payroll") { state.payroll = null; state.payrollFile = ""; state.selectedCompany = ""; render(); } if (type === "preview-payroll" || type === "download-payroll") generatePayroll(type === "preview-payroll"); if (type === "preview-fee" || type === "download-fee") generateFee(type === "preview-fee"); }
function submitAuth(event) { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target).entries()); const result = state.authMode === "register" ? auth.register(data) : auth.login(data.email, data.password); const error = document.getElementById("auth-error"); if (result.error) { error.innerHTML = `<div class="auth-error">${result.error}</div>`; return; } state.session = result.session; state.mode = result.session.role === "admin" ? "admin" : "client"; render(); }
function readXml(event) { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { state.payroll = parseSunatXml(reader.result); state.payrollFile = file.name; render(); } catch (error) { alert(error.message); } }; reader.readAsText(file); }
async function generatePayroll(previewOnly) { const company = state.companies.find((item) => item.id === state.selectedCompany); if (!company || !state.payroll) return alert("Primero cargue un XML válido y seleccione una empresa."); if (previewOnly) return openPrint(payrollDocument(company, state.payroll), `Boleta-${state.payroll.period}`); try { await downloadPayrollPdf(company, state.payroll, `Boleta-${state.payroll.period}`); state.documents.unshift({ id: `doc-${Date.now()}`, type: "boleta", title: `Boleta de pago · ${state.payroll.period}`, companyId: company.id, companyName: company.name, period: state.payroll.period, amount: state.payroll.net, createdAt: new Date().toISOString(), payload: { payroll: state.payroll } }); storage.saveDocuments(state.documents); showDownloadNotice("Boleta PDF descargada y guardada en el historial."); } catch (error) { alert("No se pudo generar la boleta PDF. Inténtelo nuevamente."); } }
async function generateFee(previewOnly) { const company = state.companies.find((item) => item.id === state.selectedCompany); const data = { date: document.getElementById("fee-date")?.value || state.feeDate, greeting: document.getElementById("fee-greeting")?.value || state.greeting, observations: document.getElementById("fee-observations")?.value || state.observations, items: state.feeItems }; if (!company) return alert("Seleccione una empresa para generar el recibo."); if (!data.items.some((item) => item.description.trim() && Number(item.amount) > 0)) return alert("Agregue al menos un concepto con un monto mayor a cero."); if (previewOnly) return openPrint(feeDocument(company, data), `Honorarios-${company.ruc}`); try { await downloadFeePdf(company, data, `Honorarios-${company.ruc}-${data.date}`); state.documents.unshift({ id: `doc-${Date.now()}`, type: "honorarios", title: `Honorarios · ${data.items[0]?.description || "Servicios profesionales"}`, companyId: company.id, companyName: company.name, amount: data.items.reduce((sum, item) => sum + Number(item.amount || 0), 0), createdAt: new Date().toISOString(), payload: { fee: data } }); storage.saveDocuments(state.documents); showDownloadNotice("Recibo de honorarios PDF descargado y guardado en el historial."); } catch (error) { alert("No se pudo generar el recibo PDF. Inténtelo nuevamente."); } }
async function downloadHistoryDocument(id) { const doc = state.documents.find((entry) => entry.id === id); const company = state.companies.find((entry) => entry.id === doc?.companyId); if (!doc || !company) return alert("No se encontró la información necesaria para descargar este documento."); try { if (doc.payload?.payroll) await downloadPayrollPdf(company, doc.payload.payroll, doc.title); if (doc.payload?.fee) await downloadFeePdf(company, doc.payload.fee, doc.title); showDownloadNotice("PDF descargado nuevamente."); } catch (error) { alert("No se pudo descargar este PDF. Inténtelo nuevamente."); } }
function showDownloadNotice(message) { const prior = document.getElementById("download-notice"); if (prior) prior.remove(); const notice = document.createElement("div"); notice.id = "download-notice"; notice.textContent = message; notice.style.cssText = "position:fixed;right:24px;bottom:24px;z-index:100;padding:15px 18px;border-radius:12px;background:#1f6b43;color:#fff;font:600 14px Arial,sans-serif;box-shadow:0 14px 35px rgba(0,0,0,.22);max-width:320px"; document.body.append(notice); setTimeout(() => notice.remove(), 3800); }
function renderCompanyModal() { const company = state.editingCompany || { id: `company-${Date.now()}`, name: "", legalName: "", ruc: "", address: "", district: "", province: "", department: "", phone: "", email: "", representative: "", color: "#b49141", active: true, createdAt: new Date().toISOString().slice(0, 10) }; root.insertAdjacentHTML("beforeend", `<div class="modal-backdrop" id="company-modal"><form class="modal company-modal" id="company-form"><button type="button" class="close-button" data-action="close-modal">×</button><span class="eyebrow">IDENTIDAD DEL CLIENTE</span><h2>${state.editingCompany ? "Editar empresa" : "Nueva empresa"}</h2><p class="modal-copy">El logo es obligatorio para generar documentos con la identidad correcta.</p><div class="form-grid"><label>Razón social<input required name="name" value="${escapeHtml(company.name)}"></label><label>RUC<input required name="ruc" value="${escapeHtml(company.ruc)}"></label><label>Representante<input required name="representative" value="${escapeHtml(company.representative)}"></label><label>Correo<input required type="email" name="email" value="${escapeHtml(company.email)}"></label><label>Teléfono<input name="phone" value="${escapeHtml(company.phone)}"></label><label>Dirección<input required name="address" value="${escapeHtml(company.address)}"></label><label>Color corporativo<input name="color" type="color" value="${company.color}"></label><label>Estado<select name="active"><option value="true" ${company.active ? "selected" : ""}>Activa</option><option value="false" ${!company.active ? "selected" : ""}>Inactiva</option></select></label></div><label>Logo de la empresa<input required="${!company.logoData}" name="logo" type="file" accept="image/png,image/jpeg"><small>PNG o JPG. Se utilizará en boletas y honorarios.</small></label><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancelar</button><button class="gold-button">Guardar empresa</button></div></form></div>`); const form = document.getElementById("company-form"); form.addEventListener("submit", (event) => saveCompany(event, company)); root.querySelectorAll('[data-action="close-modal"]').forEach((button) => button.addEventListener("click", () => document.getElementById("company-modal")?.remove())); }
function saveCompany(event, original) { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target).entries()); const file = event.target.logo.files[0]; const save = (logoData = original.logoData) => { if (!logoData) return alert("Debe cargar el logo de la empresa."); const company = { ...original, ...data, logoData, active: data.active === "true" }; state.companies = [...state.companies.filter((item) => item.id !== company.id), company]; storage.saveCompanies(state.companies); state.editingCompany = null; document.getElementById("company-modal")?.remove(); render(); }; if (file) { const reader = new FileReader(); reader.onload = () => save(reader.result); reader.readAsDataURL(file); } else save(); }

render();

/* The public site is intentionally isolated from the portal UI. */
function corporatePublicView() { return window.JKCorporate?.view(state.publicPage || "home", state.contactService || "") || ""; }

document.addEventListener("click", (event) => {
  const summaryButton = event.target.closest("[data-service-summary]");
  if (summaryButton) {
    event.preventDefault();
    window.JKCorporate?.openServiceSummary?.(summaryButton.dataset.serviceSummary);
    return;
  }
  const closeSummary = event.target.closest("[data-close-service-summary]");
  if (closeSummary) {
    event.preventDefault();
    document.querySelector(".service-summary-modal")?.remove();
    return;
  }
  const quoteButton = event.target.closest("[data-service-quote]");
  if (quoteButton) {
    event.preventDefault();
    state.contactService = quoteButton.dataset.serviceQuote;
    state.publicPage = "contact";
    document.querySelector(".service-summary-modal")?.remove();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const pageButton = event.target.closest("[data-public-page]");
  if (pageButton) {
    event.preventDefault();
    state.publicPage = pageButton.dataset.publicPage;
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }
  const serviceButton = event.target.closest("[data-service]");
  if (serviceButton) {
    event.preventDefault();
    state.publicPage = "contact";
    state.contactService = serviceButton.dataset.service;
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "corporate-contact-form") return;
  event.preventDefault();
  const request = Object.fromEntries(new FormData(event.target).entries());
  const history = JSON.parse(localStorage.getItem("jk-contact-requests") || "[]");
  history.unshift({ id: `contact-${Date.now()}`, ...request, createdAt: new Date().toISOString() });
  localStorage.setItem("jk-contact-requests", JSON.stringify(history));
  const feedback = event.target.querySelector(".form-feedback");
  feedback.textContent = "Gracias. Registramos su solicitud y le contactaremos en menos de 24 horas.";
  event.target.reset();
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-download-doc]");
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  downloadHistoryDocument(button.dataset.downloadDoc);
}, true);

/* Administrative document flows. Kept here so the vanilla app can later swap
   the local storage adapter for Supabase without changing the screens. */
const companyBadge = (company, className = "company-avatar") => `<span class="${className}" style="background:${escapeHtml(company?.color || "#b49141")}">${logoSource(company?.logoData) ? `<img src="${escapeHtml(logoSource(company.logoData))}" alt="Logo de ${escapeHtml(company.name)}">` : initials(company?.name || "JK")}</span>`;
const feeFormData = () => {
  state.feeDate = document.getElementById("fee-date")?.value || state.feeDate;
  state.greeting = document.getElementById("fee-greeting")?.value || state.greeting;
  state.observations = document.getElementById("fee-observations")?.value || state.observations;
  return { date: state.feeDate, greeting: state.greeting, observations: state.observations, items: validFeeItems(state.feeItems) };
};
const updateFeeTotal = () => root.querySelectorAll("[data-fee-total]").forEach((node) => { node.textContent = money(feeTotal(state.feeItems)); });

function feesViewV2() {
  const company = state.companies.find((item) => item.id === state.selectedCompany);
  const total = feeTotal(state.feeItems);
  return `<div class="page"><div class="page-heading"><div><span class="eyebrow">AUTOMATIZACIÓN · SERVICIOS</span><h1>Generar honorarios</h1><p>Emita un recibo institucional con conceptos, importe total, saludo y observaciones.</p></div><span class="ready-badge"><i></i> Listo para descargar</span></div><div class="generator-layout fee-layout"><section class="panel form-panel"><div class="section-title"><span class="metric-icon small">▣</span><div><h2>Datos del recibo</h2><p>Complete los datos; el PDF usará el logo y color corporativo de la empresa.</p></div></div><label>Empresa cliente<select id="fee-company"><option value="">Selecciona una empresa…</option>${state.companies.filter((item) => item.active).map((item) => `<option value="${item.id}" ${state.selectedCompany === item.id ? "selected" : ""}>${escapeHtml(item.name)} · ${item.ruc}</option>`).join("")}</select></label><label>Fecha de emisión<input id="fee-date" type="date" value="${escapeHtml(state.feeDate)}"></label><div class="items-heading"><label>Conceptos y montos</label><button type="button" class="small-button" data-action="add-fee">＋ Agregar concepto</button></div><div class="fee-items">${state.feeItems.map((item, index) => `<div class="fee-item"><span class="item-number">${index + 1}</span><input data-fee-description="${item.id}" placeholder="Ej. Contabilidad mensual" value="${escapeHtml(item.description)}"><input data-fee-amount="${item.id}" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00" value="${item.amount || ""}"><button type="button" class="delete-row" data-remove-fee="${item.id}" aria-label="Eliminar concepto">×</button></div>`).join("")}</div><label>Texto de saludo / solicitud <small>Opcional. Si queda vacío se utilizará un texto formal para la empresa seleccionada.</small><textarea id="fee-greeting" placeholder="Se genera automáticamente al elegir la empresa…">${escapeHtml(state.greeting)}</textarea></label><label>Observaciones <small>Opcional</small><textarea id="fee-observations" placeholder="Notas adicionales…">${escapeHtml(state.observations)}</textarea></label><div class="form-footer"><div class="total-inline"><span>Total calculado</span><b data-fee-total>${money(total)}</b></div><div class="generator-actions compact"><button class="secondary-button" data-action="preview-fee" ${!company ? "disabled" : ""}>◉ Vista previa PDF</button><button class="gold-button" data-action="download-fee" ${!company ? "disabled" : ""}>↓ Generar y descargar</button></div></div></section><section class="panel live-preview"><span class="eyebrow">PREVISUALIZACIÓN</span><h2>Recibo por honorarios</h2><div class="mini-document"><div class="mini-head">${companyBadge(company, "mini-logo")}<span><b>${escapeHtml(company?.name || "Selecciona una empresa")}</b><small>${escapeHtml(company?.ruc || "RUC pendiente")}</small></span></div><div class="mini-divider"></div><b>“Año de la Esperanza y el Fortalecimiento de la Democracia”</b><p>${escapeHtml(state.greeting || (company ? defaultFeeGreeting(company) : "El saludo institucional aparecerá aquí."))}</p>${state.feeItems.map((item, index) => `<div class="mini-row"><span>${index + 1}. ${escapeHtml(item.description || "Concepto pendiente")}</span><b>${money(item.amount)}</b></div>`).join("")}<div class="mini-total" style="background:${escapeHtml(company?.color || "#b49141")}"><span>TOTAL A PAGAR</span><b data-fee-total>${money(total)}</b></div></div></section></div></div>`;
}

function bindV2() {
  root.querySelectorAll("[data-scroll]").forEach((item) => item.addEventListener("click", (event) => { event.preventDefault(); document.getElementById(item.dataset.scroll)?.scrollIntoView({ behavior: "smooth" }); root.querySelector(".public-links")?.classList.remove("is-open"); }));
  root.querySelectorAll("[data-action]").forEach((item) => item.addEventListener("click", () => action(item.dataset.action)));
  root.querySelectorAll("[data-view]").forEach((item) => item.addEventListener("click", () => { state.view = item.dataset.view; render(); }));
  const authForm = document.getElementById("auth-form"); if (authForm) authForm.addEventListener("submit", submitAuth);
  const xml = document.getElementById("xml-file"); if (xml) xml.addEventListener("change", readXml);
  const templateCompany = document.getElementById("template-company"); if (templateCompany) templateCompany.addEventListener("change", () => { state.selectedCompany = templateCompany.value; render(); });
  const feeCompany = document.getElementById("fee-company"); if (feeCompany) feeCompany.addEventListener("change", () => { state.selectedCompany = feeCompany.value; const company = state.companies.find((item) => item.id === state.selectedCompany); if (!state.greeting.trim() && company) state.greeting = defaultFeeGreeting(company); render(); });
  root.querySelectorAll("[data-fee-description]").forEach((input) => input.addEventListener("input", () => { const item = state.feeItems.find((fee) => fee.id === input.dataset.feeDescription); if (item) item.description = input.value; }));
  root.querySelectorAll("[data-fee-amount]").forEach((input) => input.addEventListener("input", () => { const item = state.feeItems.find((fee) => fee.id === input.dataset.feeAmount); if (item) item.amount = Number(input.value) || 0; updateFeeTotal(); }));
  ["fee-date", "fee-greeting", "fee-observations"].forEach((id) => document.getElementById(id)?.addEventListener("input", feeFormData));
  root.querySelectorAll("[data-remove-fee]").forEach((item) => item.addEventListener("click", () => { if (state.feeItems.length > 1) { state.feeItems = state.feeItems.filter((fee) => fee.id !== item.dataset.removeFee); render(); } }));
  root.querySelectorAll("[data-delete-doc]").forEach((item) => item.addEventListener("click", () => { if (confirm("¿Eliminar este archivo del historial?")) { state.documents = state.documents.filter((doc) => doc.id !== item.dataset.deleteDoc); storage.saveDocuments(state.documents); render(); } }));
  root.querySelectorAll("[data-edit-company]").forEach((item) => item.addEventListener("click", () => { state.editingCompany = state.companies.find((company) => company.id === item.dataset.editCompany); renderCompanyModal(); }));
  root.querySelectorAll("[data-delete-company]").forEach((item) => item.addEventListener("click", () => { if (confirm("¿Eliminar esta empresa?")) { state.companies = state.companies.filter((company) => company.id !== item.dataset.deleteCompany); storage.saveCompanies(state.companies); render(); } }));
}

async function generatePayrollV2(previewOnly) {
  const company = state.companies.find((item) => item.id === state.selectedCompany);
  if (!company || !state.payroll) return alert("Primero cargue un XML válido y seleccione una empresa.");
  const filename = `Boleta-${state.payroll.period}`;
  if (previewOnly) { if (!await previewPayrollPdf(company, state.payroll, filename)) alert("El navegador bloqueó la vista previa. Permita ventanas emergentes e inténtelo nuevamente."); return; }
  try { await downloadPayrollPdf(company, state.payroll, filename); state.documents.unshift({ id: `doc-${Date.now()}`, type: "boleta", title: `Boleta de pago · ${state.payroll.period}`, companyId: company.id, companyName: company.name, period: state.payroll.period, amount: state.payroll.net, createdAt: new Date().toISOString(), payload: { payroll: state.payroll } }); storage.saveDocuments(state.documents); showDownloadNotice("Boleta PDF descargada y guardada en el historial."); } catch { alert("No se pudo generar la boleta PDF. Inténtelo nuevamente."); }
}

async function generateFeeV2(previewOnly) {
  const company = state.companies.find((item) => item.id === state.selectedCompany);
  if (!company) return alert("Seleccione una empresa para generar el recibo.");
  const data = feeFormData(); if (!data.greeting.trim()) data.greeting = defaultFeeGreeting(company);
  if (!data.items.length) return alert("Agregue al menos un concepto con un monto mayor a cero.");
  const filename = feeFilename(company, data.date);
  if (previewOnly) { if (!await previewFeePdf(company, data, filename)) alert("El navegador bloqueó la vista previa. Permita ventanas emergentes e inténtelo nuevamente."); return; }
  try { await downloadFeePdf(company, data, filename); const amount = feeTotal(data.items); state.documents.unshift({ id: `doc-${Date.now()}`, type: "honorarios", title: `Honorarios · ${data.items[0].description}`, companyId: company.id, companyName: company.name, period: data.date, amount, createdAt: new Date().toISOString(), payload: { fee: data } }); storage.saveDocuments(state.documents); showDownloadNotice("Recibo de honorarios PDF descargado y guardado en el historial."); } catch { alert("No se pudo generar el recibo PDF. Inténtelo nuevamente."); }
}

function renderCompanyModalV2() {
  const company = state.editingCompany || { id: `company-${Date.now()}`, name: "", legalName: "", ruc: "", address: "", phone: "", email: "", representative: "", color: "#b49141", active: true, createdAt: new Date().toISOString().slice(0, 10) };
  root.insertAdjacentHTML("beforeend", `<div class="modal-backdrop" id="company-modal"><form class="modal company-modal" id="company-form"><button type="button" class="close-button" data-action="close-modal">×</button><span class="eyebrow">IDENTIDAD DEL CLIENTE</span><h2>${state.editingCompany ? "Editar empresa" : "Nueva empresa"}</h2><p class="modal-copy">Registre los datos que aparecerán en boletas y recibos por honorarios.</p><div class="form-grid"><label>Razón social<input required name="name" value="${escapeHtml(company.name)}"></label><label>RUC<input required name="ruc" pattern="[0-9]{11}" inputmode="numeric" title="Ingrese los 11 dígitos del RUC" value="${escapeHtml(company.ruc)}"></label><label>Representante<input required name="representative" value="${escapeHtml(company.representative)}"></label><label>Correo<input required type="email" name="email" value="${escapeHtml(company.email)}"></label><label>Teléfono<input name="phone" value="${escapeHtml(company.phone)}"></label><label>Dirección<input required name="address" value="${escapeHtml(company.address)}"></label><label>Color corporativo<span class="color-control"><input id="company-color" name="color" type="color" value="${escapeHtml(company.color || "#b49141")}"><span id="color-swatch" class="color-swatch" style="background:${escapeHtml(company.color || "#b49141")}"></span><output id="color-value">${escapeHtml(company.color || "#b49141")}</output></span></label><label>Estado<select name="active"><option value="true" ${company.active ? "selected" : ""}>Activa</option><option value="false" ${!company.active ? "selected" : ""}>Inactiva</option></select></label></div><div class="logo-upload"><div class="logo-preview">${company.logoData ? `<img src="${escapeHtml(company.logoData)}" alt="Vista previa del logo">` : "Sin logo"}</div><div><label class="file-button" for="company-logo">Elegir logo<input id="company-logo" name="logo" type="file" accept="image/png,image/jpeg"></label><small>PNG o JPG. Se usará en boletas y honorarios.</small></div></div><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancelar</button><button class="gold-button">Guardar empresa</button></div></form></div>`);
  const form = document.getElementById("company-form"); form.addEventListener("submit", (event) => saveCompany(event, company)); document.getElementById("company-color")?.addEventListener("input", (event) => { document.getElementById("color-swatch").style.background = event.target.value; document.getElementById("color-value").textContent = event.target.value.toUpperCase(); }); root.querySelectorAll('[data-action="close-modal"]').forEach((button) => button.addEventListener("click", () => document.getElementById("company-modal")?.remove()));
}

function saveCompanyV2(event, original) {
  event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form).entries()); const ruc = String(data.ruc || "").trim(); const color = String(data.color || "").toUpperCase();
  if (!/^\d{11}$/.test(ruc)) return alert("El RUC debe contener exactamente 11 dígitos."); if (!/^#[0-9A-F]{6}$/.test(color)) return alert("Seleccione un color corporativo válido."); if (state.companies.some((item) => item.id !== original.id && item.ruc === ruc)) return alert("Ya existe una empresa registrada con ese RUC.");
  const file = form.logo.files[0]; const save = (logoData = original.logoData) => { if (!logoData) return alert("Debe cargar el logo de la empresa."); const company = { ...original, ...data, name: String(data.name).trim(), legalName: String(data.name).trim(), ruc, color, logoData, active: data.active === "true" }; state.companies = [...state.companies.filter((item) => item.id !== company.id), company]; storage.saveCompanies(state.companies); state.editingCompany = null; document.getElementById("company-modal")?.remove(); render(); };
  if (file) { const reader = new FileReader(); reader.onload = () => save(reader.result); reader.readAsDataURL(file); } else save();
}

feesView = feesViewV2;
bind = bindV2;
generatePayroll = generatePayrollV2;
generateFee = generateFeeV2;
renderCompanyModal = renderCompanyModalV2;
saveCompany = saveCompanyV2;

async function loadRemoteState() {
  if (!supabase.configured || !state.session?.accessToken) return;
  try {
    const priorCompanies = state.companies;
    const [companies, documents] = await Promise.all([supabase.companies(state.session.accessToken), supabase.documents(state.session.accessToken)]);
    state.companies = companies.map((company) => ({ ...company, logoData: logoSource(company.logoData) || logoSource(priorCompanies.find((item) => item.id === company.id)?.logoData) })); state.documents = documents; storage.saveCompanies(state.companies); storage.saveDocuments(documents); render();
  } catch (error) { console.warn("No se pudo sincronizar Supabase:", error.message); }
}

async function submitAuthV2(event) {
  event.preventDefault(); const data = Object.fromEntries(new FormData(event.target).entries()); const error = document.getElementById("auth-error"); const submit = event.target.querySelector("button[type=submit]"); if (submit) submit.disabled = true;
  const result = state.authMode === "register" ? await auth.register(data) : await auth.login(data.email, data.password);
  if (submit) submit.disabled = false; if (result.registered) { error.innerHTML = `<div class="auth-success">${escapeHtml(result.message)}</div>`; event.target.reset(); return; } if (result.error) { error.innerHTML = `<div class="auth-error">${escapeHtml(result.error)}</div>`; return; }
  state.session = result.session; state.mode = result.session.role === "admin" ? "admin" : "client"; render(); await loadRemoteState();
}

async function saveCompanyV3(event, original) {
  event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form).entries()); const ruc = String(data.ruc || "").trim(); const color = String(data.color || "").toUpperCase();
  if (!/^\d{11}$/.test(ruc)) return alert("El RUC debe contener exactamente 11 dígitos."); if (!/^#[0-9A-F]{6}$/.test(color)) return alert("Seleccione un color corporativo válido."); if (state.companies.some((item) => item.id !== original.id && item.ruc === ruc)) return alert("Ya existe una empresa registrada con ese RUC.");
  const file = form.logo.files[0]; const localLogo = file ? await new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); }) : logoSource(original.logoData); const id = supabase.configured && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(original.id) ? crypto.randomUUID() : original.id; const company = { ...original, ...data, id, name: String(data.name).trim(), legalName: String(data.name).trim(), ruc, color, logoData: localLogo, active: data.active === "true" };
  try {
    const saved = supabase.configured ? await supabase.saveCompany(company, file, state.session?.accessToken) : company;
    const persisted = { ...saved, logoData: logoSource(saved.logoData) || localLogo || "" };
    state.companies = [...state.companies.filter((item) => item.id !== persisted.id), persisted]; storage.saveCompanies(state.companies); state.editingCompany = null; document.getElementById("company-modal")?.remove(); render();
  } catch (error) { alert(`No se pudo guardar la empresa: ${error.message}`); }
}

async function persistGeneratedDocument(document, blob) {
  if (!supabase.configured) return document;
  return supabase.saveDocument(document, blob, state.session?.accessToken, state.session?.id);
}

async function generatePayrollV3(previewOnly) {
  const company = state.companies.find((item) => item.id === state.selectedCompany); if (!company || !state.payroll) return alert("Primero cargue un XML válido y seleccione una empresa."); const filename = `Boleta-${state.payroll.period}`;
  if (previewOnly) { if (!await previewPayrollPdf(company, state.payroll, filename)) alert("El navegador bloqueó la vista previa. Permita ventanas emergentes e inténtelo nuevamente."); return; }
  try { const blob = await downloadPayrollPdf(company, state.payroll, filename); let document = { id: `doc-${Date.now()}`, type: "boleta", title: `Boleta de pago · ${state.payroll.period}`, companyId: company.id, companyName: company.name, period: state.payroll.period, amount: state.payroll.net, createdAt: new Date().toISOString(), payload: { payroll: state.payroll } }; document = await persistGeneratedDocument(document, blob); state.documents.unshift(document); storage.saveDocuments(state.documents); showDownloadNotice("Boleta PDF descargada y guardada en el historial."); } catch (error) { alert(`La boleta se descargó, pero no se pudo guardar en Supabase: ${error.message}`); }
}

async function generateFeeV3(previewOnly) {
  const company = state.companies.find((item) => item.id === state.selectedCompany); if (!company) return alert("Seleccione una empresa para generar el recibo."); const data = feeFormData(); if (!data.greeting.trim()) data.greeting = defaultFeeGreeting(company); if (!data.items.length) return alert("Agregue al menos un concepto con un monto mayor a cero."); const filename = feeFilename(company, data.date);
  if (previewOnly) { if (!await previewFeePdf(company, data, filename)) alert("El navegador bloqueó la vista previa. Permita ventanas emergentes e inténtelo nuevamente."); return; }
  try { const blob = await downloadFeePdf(company, data, filename); let document = { id: `doc-${Date.now()}`, type: "honorarios", title: `Honorarios · ${data.items[0].description}`, companyId: company.id, companyName: company.name, period: data.date, amount: feeTotal(data.items), createdAt: new Date().toISOString(), payload: { fee: data } }; document = await persistGeneratedDocument(document, blob); state.documents.unshift(document); storage.saveDocuments(state.documents); showDownloadNotice("Recibo de honorarios PDF descargado y guardado en el historial."); } catch (error) { alert(`El recibo se descargó, pero no se pudo guardar en Supabase: ${error.message}`); }
}

async function deleteHistoryDocument(documentId) {
  const document = state.documents.find((item) => item.id === documentId); if (!document || !confirm("¿Eliminar este archivo del historial?")) return;
  try { if (supabase.configured) await supabase.deleteDocument(document, state.session?.accessToken); state.documents = state.documents.filter((item) => item.id !== documentId); storage.saveDocuments(state.documents); render(); } catch (error) { alert(`No se pudo eliminar el documento: ${error.message}`); }
}

function bindV3() {
  root.querySelectorAll("[data-delete-doc]").forEach((item) => item.addEventListener("click", (event) => { event.stopImmediatePropagation(); deleteHistoryDocument(item.dataset.deleteDoc); }));
  bindV2();
}

submitAuth = submitAuthV2;
saveCompany = saveCompanyV3;
generatePayroll = generatePayrollV3;
generateFee = generateFeeV3;
bind = bindV3;
loadRemoteState();

root.addEventListener("error", (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  const company = state.companies.find((item) => logoSource(item.logoData) === image.getAttribute("src"));
  const holder = image.closest(".company-avatar, .mini-logo, .logo-preview");
  if (!holder) return;
  image.remove(); holder.textContent = holder.classList.contains("logo-preview") ? "Sin logo" : initials(company?.name || "JK");
}, true);

const saveInBackground = (document, blob) => {
  if (!supabase.configured || !state.session?.accessToken) return;
  persistGeneratedDocument(document, blob).then((saved) => {
    const index = state.documents.findIndex((item) => item.id === document.id);
    if (index >= 0) { state.documents[index] = saved; storage.saveDocuments(state.documents); }
  }).catch((error) => console.warn("El PDF se descargó, pero no se sincronizó:", error.message));
};

async function generatePayrollV4(previewOnly) {
  const company = state.companies.find((item) => item.id === state.selectedCompany);
  if (!company || !state.payroll) return alert("Primero cargue un XML válido y seleccione una empresa.");
  const filename = `Boleta-${state.payroll.period}`;
  if (previewOnly) { if (!await previewPayrollPdf(company, state.payroll, filename)) alert("El navegador bloqueó la vista previa. Permita ventanas emergentes e inténtelo nuevamente."); return; }
  try {
    const blob = await downloadPayrollPdf(company, state.payroll, filename);
    const document = { id: `local-${Date.now()}`, type: "boleta", title: `Boleta de pago · ${state.payroll.period}`, companyId: company.id, companyName: company.name, period: state.payroll.period, amount: state.payroll.net, createdAt: new Date().toISOString(), payload: { payroll: state.payroll } };
    state.documents.unshift(document); storage.saveDocuments(state.documents); showDownloadNotice("Boleta PDF descargada en este dispositivo."); saveInBackground(document, blob);
  } catch { alert("No se pudo generar la boleta PDF. Inténtelo nuevamente."); }
}

async function generateFeeV4(previewOnly) {
  const company = state.companies.find((item) => item.id === state.selectedCompany);
  if (!company) return alert("Seleccione una empresa para generar el recibo.");
  const data = feeFormData(); if (!data.greeting.trim()) data.greeting = defaultFeeGreeting(company);
  if (!data.items.length) return alert("Agregue al menos un concepto con un monto mayor a cero.");
  const filename = feeFilename(company, data.date);
  if (previewOnly) { if (!await previewFeePdf(company, data, filename)) alert("El navegador bloqueó la vista previa. Permita ventanas emergentes e inténtelo nuevamente."); return; }
  try {
    const blob = await downloadFeePdf(company, data, filename);
    const document = { id: `local-${Date.now()}`, type: "honorarios", title: `Honorarios · ${data.items[0].description}`, companyId: company.id, companyName: company.name, period: data.date, amount: feeTotal(data.items), createdAt: new Date().toISOString(), payload: { fee: data } };
    state.documents.unshift(document); storage.saveDocuments(state.documents); showDownloadNotice("Recibo de honorarios descargado en este dispositivo."); saveInBackground(document, blob);
  } catch { alert("No se pudo generar el recibo PDF. Inténtelo nuevamente."); }
}

async function deleteHistoryDocumentV2(documentId) {
  const document = state.documents.find((item) => item.id === documentId);
  if (!document || !confirm("¿Eliminar este archivo del historial?")) return;
  state.documents = state.documents.filter((item) => item.id !== documentId); storage.saveDocuments(state.documents); render();
  if (supabase.configured && !document.id.startsWith("local-")) supabase.deleteDocument(document, state.session?.accessToken).catch((error) => console.warn("No se pudo eliminar de Supabase:", error.message));
}

function bindV4() {
  root.querySelectorAll("[data-delete-doc]").forEach((item) => item.addEventListener("click", (event) => { event.stopImmediatePropagation(); deleteHistoryDocumentV2(item.dataset.deleteDoc); }));
  bindV2();
}

generatePayroll = generatePayrollV4;
generateFee = generateFeeV4;
bind = bindV4;

async function deleteCompanyV2(companyId) {
  const company = state.companies.find((item) => item.id === companyId);
  if (!company || !confirm(`¿Eliminar la empresa ${company.name}?`)) return;
  try {
    if (supabase.configured) await supabase.deleteCompany(company, state.session?.accessToken);
    state.companies = state.companies.filter((item) => item.id !== companyId);
    if (state.selectedCompany === companyId) state.selectedCompany = "";
    storage.saveCompanies(state.companies);
    render();
  } catch (error) {
    alert(`No se pudo eliminar la empresa: ${error.message}`);
  }
}

function bindV5() {
  root.querySelectorAll("[data-delete-company]").forEach((item) => item.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    deleteCompanyV2(item.dataset.deleteCompany);
  }));
  bindV4();
}

bind = bindV5;

function ensureBirthdayMessage(session) {
  if (!session || session.role === "admin") return;
  const profile = storage.users().find((item) => item.id === session.id || item.email === session.email);
  const birthDate = session.birthDate || profile?.birthDate || profile?.fecha_nacimiento || "";
  const match = String(birthDate).match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (!match) return;
  const now = new Date();
  if (Number(match[1]) !== now.getMonth() + 1 || Number(match[2]) !== now.getDate()) return;
  const messageId = `birthday-${session.id}-${now.getFullYear()}`;
  const messages = storage.messages([]);
  if (messages.some((message) => message.id === messageId)) { state.messages = messages; return; }
  messages.unshift({ id: messageId, recipientId: session.id, recipientEmail: session.email, title: "¡Feliz cumpleaños!", body: "JK Studio Contable le desea un feliz cumpleaños. Gracias por permitirnos acompañarlo.", type: "birthday", sender: "JK Studio Contable", createdAt: now.toISOString(), readBy: [] });
  storage.saveMessages(messages);
  state.messages = messages;
}

function sessionInbox(session) {
  ensureBirthdayMessage(session);
  return state.messages.filter((message) => message.recipientId === "all" || message.recipientId === session.id || message.recipientEmail === session.email).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function clientViewV2() {
  const company = state.companies.find((item) => item.name.toLowerCase().includes((state.session.company || "").toLowerCase())) || state.companies[0];
  const messages = sessionInbox(state.session);
  return `<div class="client-portal"><header class="client-nav"><div class="public-brand"><span class="public-brand-mark">JK</span><span><b>Estudio JK</b><small>ESPACIO DEL CLIENTE</small></span></div><div class="client-user"><span>${initials(state.session.name).slice(0,1)}</span><div><b>${escapeHtml(state.session.name)}</b><small>${escapeHtml(state.session.email)}</small></div><button data-action="logout">Salir</button></div></header><main class="client-main"><div class="client-welcome"><span class="public-eyebrow">ESPACIO DEL CLIENTE</span><h1>Hola, ${escapeHtml(state.session.name.split(" ")[0])}.</h1><p>Su información y documentos, ordenados y disponibles cuando los necesite.</p></div><div class="client-grid"><section class="client-card client-company"><span class="service-icon">▥</span><small>EMPRESA ASOCIADA</small><h2>${escapeHtml(company?.name || state.session.company || "Su empresa")}</h2><p>${company?.ruc ? `RUC ${company.ruc}` : "Estamos configurando su espacio."}</p><button class="arrow-link">Ver información <span>→</span></button></section><section class="client-card"><div class="client-card-heading"><div><small>DOCUMENTOS RECIENTES</small><h2>${state.documents.length} archivos</h2></div><span class="service-icon">◫</span></div>${state.documents.slice(0,3).map((doc) => `<div class="client-document"><span>${doc.type === "boleta" ? "B" : "H"}</span><div><b>${escapeHtml(doc.title)}</b><small>${escapeHtml(doc.companyName)}</small></div><button>↓</button></div>`).join("") || `<p class="empty-state">Su asesor cargará aquí los documentos generados.</p>`}</section><section class="client-card client-inbox"><div class="client-card-heading"><div><small>BANDEJA DE ENTRADA</small><h2>${messages.length} mensaje${messages.length === 1 ? "" : "s"}</h2></div><span class="service-icon">✉</span></div><div class="client-inbox-list">${messages.map((message) => `<article class="client-message"><span>${message.type === "birthday" ? "★" : "✉"}</span><div><b>${escapeHtml(message.title)}</b><p>${escapeHtml(message.body)}</p></div><small>${new Date(message.createdAt).toLocaleDateString("es-PE")}</small></article>`).join("") || `<p class="empty-state">No tiene mensajes nuevos.</p>`}</div></section></div><section class="client-help"><div><span class="public-eyebrow">¿NECESITA AYUDA?</span><h2>Estamos para acompañarlo.</h2><p>Comuníquese con nuestro equipo para solicitar información o asistencia.</p></div><a class="gold-button" href="https://wa.me/51950361967" target="_blank">Contactar al estudio →</a></section></main></div>`;
}

function adminMessagesView() {
  const users = storage.users([]).filter((user) => user.role !== "admin");
  const messages = storage.messages([]).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return `<div class="page"><div class="page-heading"><div><span class="eyebrow">COMUNICACIÓN</span><h1>Mensajería</h1><p>Envíe avisos cortos a un usuario específico o a todos los registrados.</p></div><span class="ready-badge"><i></i> Bandeja preparada</span></div><div class="dashboard-grid"><section class="panel activity-panel"><div class="panel-heading"><div><span class="eyebrow">NUEVO AVISO</span><h2>Enviar mensaje</h2></div></div><form id="admin-message-form" class="message-form"><label>Destinatario<select name="recipient" required><option value="all">Todos los usuarios registrados</option>${users.map((user) => `<option value="${escapeHtml(user.id)}">${escapeHtml(user.name)} · ${escapeHtml(user.email)}</option>`).join("")}</select></label><label>Asunto<input required name="title" maxlength="80" placeholder="Ej. Información importante"></label><label>Mensaje<textarea required name="body" maxlength="280" placeholder="Escriba un mensaje breve..."></textarea></label><button class="gold-button" type="submit">Enviar mensaje</button><p class="message-feedback" aria-live="polite">${escapeHtml(state.messageFeedback)}</p></form></section><section class="panel activity-panel"><div class="panel-heading"><div><span class="eyebrow">HISTORIAL</span><h2>Mensajes enviados</h2></div><span class="history-count"><b>${messages.length}</b></span></div><div class="message-history">${messages.map((message) => `<article class="message-history-row"><div><b>${escapeHtml(message.title)}</b><small>${escapeHtml(message.body)}</small></div><span>${message.recipientId === "all" ? "Todos los usuarios" : escapeHtml(message.recipientEmail || "Usuario registrado")}</span><time>${new Date(message.createdAt).toLocaleDateString("es-PE")}</time></article>`).join("") || `<p class="empty-state">Todavía no ha enviado mensajes.</p>`}</div></section></div></div>`;
}

function adminViewV2() {
  const management = [["dashboard", "▦", "Dashboard"], ["companies", "▥", "Empresas"], ["history", "◫", "Historial de archivos"], ["messages", "✉", "Mensajería"]];
  const automation = [["templates", "↥", "Generar plantillas"], ["fees", "▣", "Generar honorarios"]];
  const content = state.view === "dashboard" ? dashboardView() : state.view === "companies" ? companiesView() : state.view === "templates" ? templatesView() : state.view === "fees" ? feesView() : state.view === "messages" ? adminMessagesView() : historyView();
  return `<div class="app-shell"><aside class="sidebar"><div class="brand"><span class="brand-mark">JK</span><div><b>Estudio JK</b><small>PANEL ADMIN</small></div></div><div class="side-group"><span class="side-label">GESTIÓN</span>${management.map(([view, icon, label]) => `<button class="side-link ${state.view === view ? "active" : ""}" data-view="${view}"><span>${icon}</span>${label}</button>`).join("")}</div><div class="side-group automation"><span class="side-label">AUTOMATIZACIÓN</span>${automation.map(([view, icon, label]) => `<button class="side-link ${state.view === view ? "active" : ""}" data-view="${view}"><span>${icon}</span>${label}</button>`).join("")}</div><div class="sidebar-spacer"></div><div class="side-user"><span class="avatar">J</span><div><b>${escapeHtml(state.session.name)}</b><small>${escapeHtml(state.session.email)}</small></div></div><button class="logout" data-action="logout">↪ <span>Cerrar sesión</span></button></aside><div class="main-shell"><header class="topbar"><button class="menu-button" data-action="menu">☰</button><span class="topbar-rule"></span><span class="topbar-title">Panel administrativo</span><div class="topbar-spacer"></div><span class="status-dot"></span><span class="topbar-status">Modo local preparado para Supabase</span></header><main>${content}</main></div></div>`;
}

async function sendAdminMessage(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const title = String(data.title || "").trim();
  const body = String(data.body || "").trim();
  if (!title || !body) return;
  const recipient = data.recipient === "all" ? { id: "all", email: "" } : storage.users([]).find((user) => user.id === data.recipient) || { id: data.recipient, email: "" };
  const message = { id: `local-${Date.now()}`, recipientId: recipient.id, recipientEmail: recipient.email, title, body, type: "admin", sender: state.session.email, createdAt: new Date().toISOString(), readBy: [] };
  try {
    const saved = supabase.configured ? await supabase.saveMessage(message, state.session?.accessToken) : message;
    const messages = [saved, ...storage.messages([]).filter((item) => item.id !== saved.id)];
    storage.saveMessages(messages);
    state.messages = messages;
    state.messageFeedback = recipient.id === "all" ? "Mensaje enviado a todos los usuarios registrados." : "Mensaje enviado correctamente.";
    render();
  } catch (error) {
    state.messageFeedback = "";
    alert(`No se pudo enviar el mensaje: ${error.message}`);
  }
}

function bindV6() {
  bindV5();
  root.querySelectorAll("[data-close-flyer]").forEach((item) => item.addEventListener("click", () => root.querySelector(".site-flyer")?.remove()));
  const messageForm = document.getElementById("admin-message-form");
  if (messageForm) messageForm.addEventListener("submit", sendAdminMessage);
}

clientView = clientViewV2;
adminView = adminViewV2;
bind = bindV6;

const noLogoPath = (value) => ["", "sin-logo", "__sin_logo__"].includes(String(value || "").trim());
const storedLogo = (company) => !noLogoPath(company?.logoPath);
const updateCompanyInState = (company) => {
  state.companies = state.companies.map((item) => item.id === company.id ? company : item);
  storage.saveCompanies(state.companies);
  return company;
};

async function refreshCompanyLogoForDocument(company) {
  if (!storedLogo(company)) return company;
  if (!supabase.configured || !state.session?.accessToken) {
    if (logoSource(company.logoData)) return company;
    throw new Error(`No se pudo validar el logo de ${company.name}. Inicie sesión nuevamente y vuelva a intentarlo.`);
  }
  const freshLogo = logoSource(await supabase.logoUrl(company.logoPath, state.session.accessToken));
  if (!freshLogo) throw new Error(`No se pudo cargar el logo de ${company.name}. Vuelva a guardarlo desde Empresas e inténtelo nuevamente.`);
  return updateCompanyInState({ ...company, logoData: freshLogo, logoError: "" });
}

async function loadRemoteStateV2() {
  if (!supabase.configured || !state.session?.accessToken) return;
  const priorCompanies = state.companies;
  if (state.session.role !== "admin") await supabase.ensureBirthdayMessage(state.session.accessToken).catch((error) => console.warn("No se pudo preparar el mensaje de cumpleaños:", error.message));
  const [companiesResult, documentsResult, messagesResult, usersResult] = await Promise.allSettled([
    supabase.companies(state.session.accessToken),
    supabase.documents(state.session.accessToken),
    supabase.messages(state.session.accessToken),
    state.session.role === "admin" ? supabase.users(state.session.accessToken) : Promise.resolve(null),
  ]);
  let changed = false;
  if (companiesResult.status === "fulfilled") {
    state.companies = companiesResult.value.map((company) => {
      const previous = priorCompanies.find((item) => item.id === company.id);
      return { ...company, logoData: logoSource(company.logoData) || cachedLogoSource(previous?.logoData) };
    });
    storage.saveCompanies(state.companies);
    changed = true;
  } else console.warn("No se pudieron sincronizar las empresas:", companiesResult.reason?.message || companiesResult.reason);
  if (documentsResult.status === "fulfilled") {
    state.documents = documentsResult.value;
    storage.saveDocuments(state.documents);
    changed = true;
  } else console.warn("No se pudo sincronizar el historial:", documentsResult.reason?.message || documentsResult.reason);
  if (messagesResult.status === "fulfilled") {
    state.messages = messagesResult.value;
    storage.saveMessages(state.messages);
    changed = true;
  } else console.warn("No se pudieron sincronizar los mensajes:", messagesResult.reason?.message || messagesResult.reason);
  if (usersResult.status === "fulfilled" && usersResult.value) {
    storage.saveUsers(usersResult.value);
    changed = true;
  }
  if (changed) render();
}

async function saveCompanyV4(event, original) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  delete data.logo;
  const ruc = String(data.ruc || "").trim();
  const color = String(data.color || "").toUpperCase();
  if (!/^\d{11}$/.test(ruc)) return alert("El RUC debe contener exactamente 11 dígitos.");
  if (!/^#[0-9A-F]{6}$/.test(color)) return alert("Seleccione un color corporativo válido.");
  if (state.companies.some((item) => item.id !== original.id && item.ruc === ruc)) return alert("Ya existe una empresa registrada con ese RUC.");
  const file = form.logo.files[0];
  const localLogo = file ? await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error("No se pudo leer el archivo del logo.")); reader.readAsDataURL(file); }) : cachedLogoSource(original.logoData);
  const id = supabase.configured && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(original.id) ? crypto.randomUUID() : original.id;
  const company = { ...original, ...data, id, name: String(data.name).trim(), legalName: String(data.name).trim(), ruc, color, logoData: localLogo, active: data.active === "true" };
  const submit = form.querySelector("button[type=submit]");
  if (submit) submit.disabled = true;
  try {
    const saved = supabase.configured ? await supabase.saveCompany(company, file, state.session?.accessToken) : company;
    const persisted = { ...saved, logoData: logoSource(saved.logoData) || localLogo || "" };
    state.companies = [...state.companies.filter((item) => item.id !== persisted.id), persisted];
    storage.saveCompanies(state.companies);
    state.editingCompany = null;
    document.getElementById("company-modal")?.remove();
    render();
  } catch (error) {
    alert(`No se pudo guardar la empresa: ${error.message}`);
  } finally {
    if (submit) submit.disabled = false;
  }
}

async function generatePayrollV5(previewOnly) {
  let company = state.companies.find((item) => item.id === state.selectedCompany);
  if (!company || !state.payroll) return alert("Primero cargue un XML válido y seleccione una empresa.");
  const filename = `Boleta-${state.payroll.period}`;
  try {
    company = await refreshCompanyLogoForDocument(company);
    if (previewOnly) { if (!await previewPayrollPdf(company, state.payroll, filename)) alert("El navegador bloqueó la vista previa. Permita ventanas emergentes e inténtelo nuevamente."); return; }
    const blob = await downloadPayrollPdf(company, state.payroll, filename);
    const document = { id: `local-${Date.now()}`, type: "boleta", title: `Boleta de pago · ${state.payroll.period}`, companyId: company.id, companyName: company.name, period: state.payroll.period, amount: state.payroll.net, createdAt: new Date().toISOString(), payload: { payroll: state.payroll } };
    state.documents.unshift(document);
    storage.saveDocuments(state.documents);
    showDownloadNotice("Boleta PDF descargada en este dispositivo.");
    saveInBackground(document, blob);
  } catch (error) { alert(error.message || "No se pudo generar la boleta PDF. Inténtelo nuevamente."); }
}

async function generateFeeV5(previewOnly) {
  let company = state.companies.find((item) => item.id === state.selectedCompany);
  if (!company) return alert("Seleccione una empresa para generar el recibo.");
  const data = feeFormData();
  if (!data.greeting.trim()) data.greeting = defaultFeeGreeting(company);
  if (!data.items.length) return alert("Agregue al menos un concepto con un monto mayor a cero.");
  const filename = feeFilename(company, data.date);
  try {
    company = await refreshCompanyLogoForDocument(company);
    if (previewOnly) { if (!await previewFeePdf(company, data, filename)) alert("El navegador bloqueó la vista previa. Permita ventanas emergentes e inténtelo nuevamente."); return; }
    const blob = await downloadFeePdf(company, data, filename);
    const document = { id: `local-${Date.now()}`, type: "honorarios", title: `Honorarios · ${data.items[0].description}`, companyId: company.id, companyName: company.name, period: data.date, amount: feeTotal(data.items), createdAt: new Date().toISOString(), payload: { fee: data } };
    state.documents.unshift(document);
    storage.saveDocuments(state.documents);
    showDownloadNotice("Recibo de honorarios descargado en este dispositivo.");
    saveInBackground(document, blob);
  } catch (error) { alert(error.message || "No se pudo generar el recibo PDF. Inténtelo nuevamente."); }
}

loadRemoteState = loadRemoteStateV2;
saveCompany = saveCompanyV4;
generatePayroll = generatePayrollV5;
generateFee = generateFeeV5;
render();
loadRemoteState();
