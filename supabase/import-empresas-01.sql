-- Importación masiva de 9 empresas sin logo.
-- Ejecutar en Supabase > SQL Editor. Si una empresa ya existe por RUC, sus datos se actualizan.
-- El valor 'sin-logo' permite que el PDF use las iniciales y el color corporativo hasta que se suba un logo.

with empresas_importar (nombre, ruc, representante, telefono, correo, direccion, color_corporativo, estado) as (
  values
    ('CORPORACIÓN CHÁVEZ E.I.R.L.', '20489725437', 'RONALD RUBEN CHAVEZ CALDERON', '988012434', 'distribucioneschavez@hotmail.com', 'AV. UNIVERSITARIA N° 2061 PILLCO MARCA - HUANUCO', '#293c89', true),
    ('CHAVEZ CALDERON HENDERSON ELI', '10454771961', 'CHAVEZ CALDERON HENDERSON ELI', '996902489', 'elihendersonc@gmail.com', 'AV. UNIVERSITARIA KM. 3 URB CAYHUAYNA ALTA HUANUCO-HUANUCO-PILLCO MARCA', '#41a7b4', true),
    ('CHAVEZ CALDERON GENRRY JOEL', '10417535824', 'CHAVEZ CALDERON GENRRY JOEL', '982378381', 'genrrychavezcalderon@gmail.com', 'AV. UNIVERSITARIA KM 03 URB. CAYHUAYNA ALTA HUANUCO-HUANUCO-PILLCO MARCA', '#b241b4', true),
    ('AMAZON HOMECENTER E.I.R.L.', '20614011018', 'DALILA ALEJO JACINTO', '967597658', 'Amazonhc18@gmail.com', 'Av. UNIVERSITARIA N° 3823 Pillco Marca - Cayhuayna – Huánuco', '#ea770b', true),
    ('ESCUELA FORMATIVA DE FUTBOL REAL HUANUCO” S.R.L.', '20610261834', 'MIDA AGUIRRE CANO', '969205533', 'kberaun30@gmail.com', 'JR. HERMILIO VALDIZAN N° 725 HUANUCO-HUANUCO', '#de601b', true),
    ('COMERCIALIZADORA TRIMAR E.I.R.L.', '20573280882', 'ORELLANA IZARRA MIRIAM', '962549733', 'distribucioneschavez@hotmail.com', 'CALLE LAS CASUARINAS LT.6 - CPME. PITUMAMA - PILLCO MARCA - HUANUCO', '#34ea9b', true),
    ('DISTRIBUIDORA Y MAYORISTA CHAVEZ E.I.R.L.', '20615911292', 'CHAVEZ CALDERON GENRRY JOEL', '982378381', 'genrrychavezcalderon@gmail.com', 'JR. LOS ALAMOS N°341 PILLCO MARCA - HUANUCO', '#9b41b4', true),
    ('TRANSPORTES GENERALES DEA S.A.C.', '20614099101', 'ALBERTO HUAQUI YERSON', '987612565', 'transportesdeasac@gmail.com', 'AV. EL PARAISO MZ. J LT. 2 CONCHAMARCA-AMBO-HUANUCO', '#b44152', true),
    ('CONSTRUCTORA Y CONSULTORA YED E.I.R.L.', '20611759861', 'ALBERTO HUAQUI YERSON', '987612565', 'yed19cat@gmail.com', 'CAR. CAR. CENTRAL S/N PILLCO MARCA- HUANUCO', '#419db4', true)
)
insert into public.empresas (
  nombre, razon_social, ruc, direccion, telefono, correo, representante,
  logo_url, color_corporativo, estado
)
select
  nombre, nombre, ruc, direccion, telefono, correo, representante,
  'sin-logo', color_corporativo, estado
from empresas_importar
on conflict (ruc) do update set
  nombre = excluded.nombre,
  razon_social = excluded.razon_social,
  direccion = excluded.direccion,
  telefono = excluded.telefono,
  correo = excluded.correo,
  representante = excluded.representante,
  color_corporativo = excluded.color_corporativo,
  estado = excluded.estado,
  logo_url = case
    when public.empresas.logo_url is null or public.empresas.logo_url in ('', 'sin-logo', '__sin_logo__') then 'sin-logo'
    else public.empresas.logo_url
  end;

-- Nota de verificación: la tercera dirección se completó como "PILLCO MARCA"
-- porque la captura quedó recortada al final y las demás direcciones muestran esa misma localidad.
