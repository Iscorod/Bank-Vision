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
