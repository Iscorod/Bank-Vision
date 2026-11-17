# BankVision — Cuadro de mando financiero bancario

Aplicación web estática con **seis pestañas interactivas**, basada en el modelo bancario sintético de 2024 (300.053 registros en el archivo Excel original). Preparada para Vercel, GitHub Pages o cualquier alojamiento estático HTTPS.

## Características

- **Visión ejecutiva**: activos, créditos, depósitos, márgenes, ROE, ROA, CET1, eficiencia, productos, oficinas y captación.
- **Rentabilidad y márgenes**: PyG, waterfall de margen, mix de ingresos, rankings y rentabilidad frente a eficiencia.
- **Riesgo y morosidad**: NPL, Stage 2/3, cobertura, provisiones, rating, mapa de calor y sectores vigilados.
- **Liquidez y solvencia**: LCR, NSFR, CET1, Tier 1, RWA, vencimientos, buffer de activos y pruebas de estrés.
- **Clientes y productos**: base activa, vinculación, altas/bajas, embudo comercial, canales y 14 productos.
- **Red de oficinas**: 156 oficinas, gestores, ingresos comerciales, productividad, eficiencia, regiones y satisfacción.

Filtros de periodo (año / trimestre / mes), región, oficina, segmento, producto y canal. Gráficos SVG/CSS nativos, tablas, exportación CSV y diseño claro adaptable a móvil. La interfaz está en español.

**Importante:** todos los registros son ficticios. Las cifras son resultados calculados a partir de las tablas del Excel, no valores de un banco real. Algunos datos regulatorios solo tienen granularidad regional/bancaria y se muestran con esa advertencia; los datos por canal corresponden a leads, no a PyG.

## Probarlo localmente

Este proyecto **no requiere `npm install` ni compilación**.

```bash
cd banking-dashboard-vercel
python -m http.server 8000
```

Abre `http://localhost:8000` desde tu navegador. No abras `index.html` mediante `file://` porque los navegadores bloquean los archivos JSON cargados por `fetch` en ese modo.

## Publicar en Vercel

### Opción recomendada: GitHub + Vercel

1. Crea un repositorio en GitHub llamado `bankvision-banking-dashboard`.
2. Sube **el contenido de esta carpeta**, incluyendo `index.html`, `app.js`, `styles.css`, `vercel.json`, `assets/` y `data/`.
3. En [Vercel](https://vercel.com/new), selecciona **Add New → Project → Import Git Repository**.
4. Elige el repositorio. Para **Framework Preset**, utiliza `Other` (estático). Deja **Build Command** vacío; no hay `npm install`. El directorio de salida es la raíz del proyecto.
5. Pulsa **Deploy**. Vercel creará un dominio `*.vercel.app` público. No necesitas variables de entorno.

### Opción CLI

```bash
npm install -g vercel
cd banking-dashboard-vercel
vercel login
vercel --prod
```

Selecciona `Other`, no establezcas comando de build y usa la carpeta raíz. La opción CLI requiere tu propia sesión autenticada en Vercel.

## Origen de los datos

Los datos del Excel se preprocesaron como JSON para que no sea necesario descargar y parsear el Excel completo en cada visita. La web carga agregados región/mes/segmento/producto para el inicio y descarga datos de la región en detalle solo cuando eliges una oficina.

- `data/core-regions.json`: agregaciones de cartera y resultados financieros por región, mes, segmento y producto.
- `data/core-offices-r*.json`: cartera y resultados a nivel oficina, cargados bajo demanda.
- `data/clients.json`, `data/leads.json`, `data/ratings.json`, `data/offices-monthly.json`, `data/campaigns.json`: hechos granulares del Excel.
- `data/liquidity.json`, `data/maturities.json`, `data/liquid-assets.json`, `data/stress.json`: hechos de liquidez y solvencia.
- `data/meta.json`, `data/schema.json`: catálogos, claves, columnas y unidades.

Para regenerar los JSON desde tu Excel:

```bash
python scripts/build_data.py /ruta/al/modelo_bancario_300k_powerbi_2024.xlsx
```

Requiere Python 3 y `lxml` en el entorno de generación (solo para regenerar, no para servir la web).

## Definición de KPIs

**Saldos**: créditos, depósitos, inversiones, activos, exposición, dudosos, provisiones, RWA y capital corresponden al **último cierre mensual del periodo seleccionado**, no se suman a lo largo de los doce meses.

**Flujos**: ingresos, costes, deterioros, beneficio, altas, bajas, leads y conversiones se suman en los meses seleccionados.

- Margen financiero = ingresos por intereses − coste de financiación.
- Comisiones netas = ingresos por comisiones − coste por comisiones.
- Margen bruto = margen financiero + comisiones netas + otros ingresos.
- Margen neto = margen bruto − gastos de explotación.
- Beneficio neto = margen neto − deterioros − impuestos.
- Eficiencia = gastos de explotación / margen bruto.
- NPL = saldo dudoso / saldo de créditos.
- Cobertura = provisiones / saldo dudoso.
- Coste del riesgo = deterioros anualizados / créditos a cierre.
- ROE = beneficio anualizado / patrimonio asignado.
- ROA = beneficio anualizado / activos asignados.
- LCR = activos HQLA / salidas netas estimadas a 30 días.
- NSFR = financiación estable disponible / financiación estable requerida.
- CET1 = capital CET1 / activos ponderados por riesgo (RWA).
- Conversión comercial = etapa actual / etapa anterior.

ROE/ROA de segmentos/productos se calculan con asignaciones **estimativas** de capital según RWA y activos según volumen de negocio. No representan contabilidad regulatoria de una entidad real. Las variaciones interanuales solo se muestran cuando el Excel ofrece un dato comparativo.

## Limitaciones intencionales

- No existe servidor ni autenticación: los JSON son **públicos** al desplegarse. Úsalos únicamente con datos sintéticos.
- Los filtros de *canal* afectan exclusivamente a la captación de leads; *producto* y *segmento* afectan a los hechos que poseen esas dimensiones. Los indicadores regulatorios se agregan por región y no se desglosan por producto o oficina.
- Los gráficos son SVG interactivos y componentes HTML, sin dependencia de terceros para visualización.
- La fuente web externa (`Google Fonts`) es opcional; si no carga, se muestran tipografías de reserva.
- La exportación CSV contiene la vista agregada/filtrada de cartera y resultados, no todo el Excel original.

## Pruebas

```bash
node --check app.js
node scripts/test_logic.cjs
python scripts/verify_data.py
```

Licencia de demostración: uso personal y de portfolio. Sin logotipos ni información financiera de entidades reales.


## Mejoras de interfaz (noviembre 2026)

- Identidad BankVision actualizada: símbolo bancario con barras de crecimiento, sin iniciales «BV»; logotipo y favicon nuevos.
- Barra lateral: nombre en vertical sin recortes, y scroll en alturas de pantalla pequeñas.
- Dispersión «Productividad vs. eficiencia»: zoom a los rangos de datos, eje Y en k€ (no %), y detalles al pasar el cursor o utilizar Tab, evitando solapamientos permanentes.


## Auditoría de conciliación — versión 3

Tras la revisión de Visión ejecutiva 2024, Región Norte, se han aplicado estas correcciones **a la web** (no al Excel original):

- **PyG reconciliada en el gráfico principal:** ingresos brutos = intereses brutos + comisiones brutas + otros ingresos; costes = financiación + comisiones pagadas + explotación + deterioros + impuestos. Diferencia = beneficio neto, mes a mes. El gráfico muestra flujos **mensuales**, no acumulados.
- **Ingresos de red:** las oficinas suman los mismos ingresos brutos que la PyG en cada mes y región. Se comprobó la conciliación; antes se comparaban indebidamente con el margen bruto después de financiación.
- **Eficiencia bancaria vs. gasto comercial local:** el 46,78 % regional es gasto de explotación / margen bruto; el ~12,2 % de las oficinas es gasto comercial local / ingreso bruto de oficina. Se han separado nombres y notas; **no son medidas equivalentes**.
- **Márgenes:** margen financiero = intereses netos; margen bruto = margen financiero + comisiones netas + otros; margen neto = margen bruto − explotación; beneficio neto = margen neto − deterioro − impuestos.
- **Scatter de riesgo:** muestra ROE negativo en la escala y marca estos segmentos en rojo; los puntos no se sustituyen por 0. Ticks de los ejes redondeados y etiquetas mediante tooltip para evitar solapes.
- **Productos:** muestra todos los productos con saldos positivos en tres grupos (créditos, depósitos e inversiones) con la suma de cada grupo, conciliada con su KPI.
- **KPIs sin histórico:** se sustituyeron las etiquetas incorrectas de “Variación anual” por la definición o el contexto del indicador. Solo aparece la variación cuando existe comparativo.
- **Saldos frente a flujos:** “Créditos concedidos” y “Depósitos captados” en el resumen se han sustituido por “Créditos en cartera” y “Depósitos a cierre”. Para el año completo, el ROA se etiqueta como ejercicio calculado con activos a cierre, no anualizado.
- **Provisiones/dudosos:** se etiqueta como **proxy**, porque la base no contiene la provisión Stage 3 específica. Por tanto no constituye una cobertura NPL regulatoria verificable.

### Controles automáticos

```bash
node scripts/audit_financial.cjs
node scripts/test_logic.cjs
python scripts/verify_data.py
```

El test `audit_financial.cjs` contiene 300 conciliaciones de región × mes × tipo: beneficio = ingresos brutos − costes; suma del ingreso de oficinas = ingreso bruto financiero; y sumas por producto para créditos, depósitos e inversiones.

### Limitaciones que permanecen en los datos simulados

**Estos aspectos deben corregirse regenerando el Excel y los JSON de origen; no se han alterado los datos para que el dashboard parezca más realista:**

1. La generación de ingresos/activos, productividad, ratio de gasto local y satisfacción por oficina resulta excesivamente homogénea. Aunque las sumas concilian, falta variabilidad orgánica por tamaño, mezcla de productos, ocupación y costes.
2. En 2024 Norte, Banca Privada e Institucional presentan ROE negativos y ratios de eficiencia extraordinariamente altos. Ahora se muestran correctamente como negativos, pero es recomendable recalibrar la simulación financiera de estos segmentos antes de mostrarla como ejemplo representativo de banca.
3. La relación entre provisiones **totales** y créditos dudosos es del 145,82 % en Norte. No implica necesariamente una cobertura regulatoria de Stage 3 y exige detalle específico de provisiones por fase para usar esa denominación.
4. No existe histórico completo 2023 para ROE, ROA, CET1, eficiencia, ingresos y activos: no se deben fabricar variaciones YoY.

**Cifras validadas Región Norte (2024):** ingresos brutos 1.050,30 M€; margen financiero 412,72 M€; margen bruto 582,19 M€; gasto de explotación 272,36 M€; margen neto 309,83 M€; beneficio neto 179,22 M€; créditos 16.207,20 M€ y depósitos 21.246,74 M€.
