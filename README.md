# BankVision v7 · Cuadro de mando financiero bancario

**Proyecto web estático y responsive para Vercel con seis pestañas interactivas y datos completamente simulados de 2024.** Todos los importes son **M€**, salvo indicación en contrario. El sistema **no** contiene datos de una entidad financiera real. No requiere React, Node, build ni variables de entorno en producción: sirve `index.html` con `app.js`, `styles.css` y `data/*.json`.

## Publicar en Vercel

1. Descomprime el ZIP y sube el contenido de la carpeta **`bankvision-v7`** a un repositorio de GitHub (el `index.html` debe quedar en la raíz).
2. Importa ese repositorio en Vercel. Framework preset **Other**; sin comando de compilación; directorio de salida **`.`** o vacío según configuración.
3. Comprueba el sitio desplegado. Los filtros de **Año / Trimestre / Mes**, Región, Oficina, Segmento, Producto y Canal y el botón **CSV** están en la cabecera. La tarjeta de cartera tiene sus propios filtros de familia/producto.
4. Por motivos de caché, `index.html` utiliza `app.js?v=7` y `styles.css?v=7`.

Para desarrollo local, ejecuta desde la raíz `python -m http.server 8000` y abre `http://localhost:8000`. Abrir `index.html` con `file://` **no funciona** por la carga de JSON.

## Estado de los ocho puntos de la auditoría

| Nº | Corrección v7 | Verificación / alcance |
| --- | --- | --- |
| 1 | ROE verificable | Scatter con burbujas proporcionales a patrimonio asignado; leyenda con capital y peso; tabla desplegable de PyG, patrimonio y RWA por segmento; sumas al mismo ROE consolidado. |
| 2 | Pérdidas inexplicadas con mora baja | Reasignación **simulada** de costes de financiación mediante transfer pricing interno. Banca Privada e Institucional pasan a ROE positivos y moderados. Se mantiene el **beneficio total por región y mes**, sin esconder resultados. Es un escenario de calibración, **no un ajuste contable documentado de un banco real**. |
| 3 | Scatter solapado / leyenda cortada | Leyenda siempre visible **encima** del scatter ejecutivo, coordenadas exactas, números de marcador y líneas discontinuas al separar puntos solo visualmente. |
| 4 | Comisiones parciales | La página Rentabilidad incluye un gráfico específico de **comisiones netas de los 14 productos**: las comisiones de 3 servicios son un subconjunto de las 839 M€ totales. |
| 5 | Margen bruto y financiero | Se muestran como mini-KPI en la banda financiera, con definiciones de margen neto y denominadores; no se confunden con ingreso bruto. |
| 6 | Patrimonio asignado, CET1 y RWA | Banda de capital y desplegable con cuentas y RWA. El patrimonio asignado **9.376,5 M€** y capital CET1 **7.749,2 M€** son magnitudes de perímetro distinto. **No existe en el origen una conciliación de ajustes prudenciales**, por lo que solo se publica su diferencia aritmética, no se inventa un puente regulatorio. |
| 7 | Cobertura crediticia casi uniforme | Modelo nuevo de pérdidas esperadas por Stage 1, 2 y 3, región, segmento, producto y mes. En diciembre, **cobertura específica Stage 3** por región: **65,3 % / 71,4 % / 76,5 % / 68,8 % / 74,5 %**. El saldo de reservas es la suma exacta de las tres fases. |
| 8 | Productividad y activos por gestor irreales | Se distinguen ingresos bancarios brutos, ingresos **comerciales atribuibles** al equipo, gestores, y **FTE asignados** (incluye soporte). La productividad ahora divide ingresos atribuibles entre gestores-mes. Los activos/FTE y la productividad de gestores son supuestos sintéticos, no benchmarks de mercado. |

## Grandes cifras v7 · sin filtros · ejercicio 2024

- Beneficio neto: **1.046,39 M€**, **sin cambios** respecto al banco original.
- ROE: **11,16 %**; patrimonio asignado **9.376,52 M€**; RWA diciembre **56.859,98 M€**; CET1 **7.749,19 M€**.
- Comisiones netas totales: **839,00 M€** para los 14 productos; los servicios solo aportan aproximadamente 64,07 M€.
- ROE por segmento recalibrado: Particulares **11,34 %**, Pymes **11,74 %**, Empresas **11,18 %**, Banca Privada **7,38 %**, Institucional **6,50 %**.
- Plantilla equivalente asignada a oficinas al cierre: **10.298 FTE** (incluye soporte); gestores comerciales al cierre: **1.360**.
- Productividad comercial simulada: aproximadamente **0,24–1,51 M€ por gestor/año**, según oficina. Activos por FTE: **10,7–18,4 M€**.

## Granularidad y definiciones

**Stock vs. flujo:** créditos, depósitos, activos, riesgo y liquidez son saldos del **último mes seleccionado**. Ingresos, costes, beneficio, comisiones, leads y captaciones son **sumas del intervalo**. En periodos cortos, los ratios ROE y ROA son estimaciones anualizadas con factor `12 / meses seleccionados` y se indican como estimación.

**Segmentos:** el patrimonio contable sintético de cada ámbito se asigna proporcionalmente a RWA. El denominador agregado se conserva. `ROE = beneficio anualizado / patrimonio asignado`. El **CET1 ratio** se calcula por otro criterio: `capital CET1 prudencial / RWA`. No se compara directamente una oficina filtrada con el capital regulatorio de toda su región.

**Reservas Stage:** el ejercicio simula exposiciones exclusivas Stage 1, Stage 2 y Stage 3, con reservas de cada fase. `Cobertura Stage 3 = provisión específica Stage 3 / saldo dudoso Stage 3`. `Reserva total / dudosos` **no** se denomina cobertura Stage 3. La tabla rating-sectores es una **muestra independiente**, por lo que sus reservas no reconcilian con toda la cartera y sus tasas no deben interpretarse como cobertura regulatoria.

**Ingresos de oficinas:** `Ingresos bancarios brutos` es la suma de toda la actividad bancaria distribuida a oficinas. `Ingresos comerciales atribuibles` es una parte **simulada** según el factor por oficina/mes en `data/office-attribution-v7.csv`. `Gestores` son comerciales activos. `FTE asignados` es plantilla equivalente, **incluyendo funciones de soporte imputadas**. La productividad comercial de la tabla es `Σ ingresos comerciales atribuibles × 1.000 / Σ gestores-mes`, expresada en k€/gestor-mes. Gastos locales / ingresos brutos no es el ratio de eficiencia bancaria (gasto de explotación / margen bruto).

**Transfer pricing v7:** se modifica el **coste de financiación entre segmentos** mes y región de forma que `Σ ajustes = 0` por cada región/mes, manteniendo intereses, comisiones, otros ingresos, gastos de explotación, deterioros, impuestos y beneficio regional global. No se cambian créditos, depósitos, dudosos, activos ni RWA. Es una **recalibración hipotética** para un portfolio, no evidencia de márgenes reales.

## Archivos y linaje

| Archivo | Función |
| --- | --- |
| `data/core-regions.json` | 4.200 hechos consolidados mensuales recalibrados para financiación y reservas, fuente de consulta por región. |
| `data/core-offices-r1…r5.json` | 131.040 registros de detalle de oficinas, conciliados con los consolidados recalibrados. |
| `data/core-regions-baseline-v6.json` | Copia de referencia anterior, para que la auditoría v7 sea autosuficiente. **No se usa en el dashboard**. |
| `data/risk-stages-v7.json/.csv` | 4.200 filas, saldos y provisiones por Stage, mes, región, segmento y producto. |
| `data/office-attribution-v7.json/.csv` | 1.872 filas de ingresos atribuibles, gestores indirectos/FTE y factor por oficina/mes. |
| `data/transfer-pricing-v7.json/.csv` | 300 filas de redistribuciones de financiación por región/mes/segmento. |
| `data/core-adjustments-v7.csv` | 4.200 valores de financiación y provisiones revisados por la clave de cartera y PyG. |
| `scripts/recalibrate_risk_staff_v7.py` | Generador reproducible **solo desde JSON v6 sin recalibrar**. Un segundo pase sobre datos v7 está bloqueado. |
| `scripts/audit_v7.cjs` | Auditoría numérica y comprobaciones de componentes, **incluido el escenario v6 de referencia**. |
| `BankVision_v7_Adenda_Financiera.xlsx` | Excel complementario descargable **por separado**, para enriquecer el libro original de 300.053 filas. |

El **Excel original** sigue siendo la base v3; la **adenda v4** revisó diversidad de oficinas y la **adenda v7** revisa ECL, financiación y productividad. Por ello, **el XLSX original por sí solo ya no reproduce exactamente el dashboard v7**. La fuente autoritativa de la web son los JSON de este paquete, y los CSV/XLSX de la adenda permiten reconstruir las dimensiones modificadas para Power BI.

## Validación

```bash
node --check app.js
node scripts/audit_financial.cjs
node scripts/audit_branch_v4.cjs
node scripts/audit_v7.cjs
node scripts/test_logic.cjs
node scripts/test_render_v5.cjs
node scripts/test_render_v6.cjs
```

- Se han superado **300** controles generales, **90.132** conciliaciones de cartera con oficinas y **71.386** verificaciones granulares v7 más 27 estados de interfaz. Se han inspeccionado capturas offline a **1440 y 390 px** (6 variantes) con Chromium.
- La versión web completa **no está desplegada** desde este paquete. El navegador bloqueó visitar `localhost`, así que las capturas se construyen usando HTML y datos de la aplicación renderizados sin red; **no equivalen a una prueba end-to-end publicada en Vercel**.
- Se puede exportar a CSV desde la cabecera. El CSV es el resultado de los datos financieros filtrados; los overlays v7 también se entregan como CSV.

**Uso exclusivo ilustrativo para portfolio. No utilizar para decisiones de crédito, reporting regulatorio o modelos contables reales.**
