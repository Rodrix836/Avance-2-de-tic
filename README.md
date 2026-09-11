# Avance-2-de-tic

## Porter IA · Arquetipo sistémico

Página web interactiva sobre las cinco fuerzas de Porter aplicada a plataformas y servicios de inteligencia artificial generativa. Conecta el análisis competitivo con una adaptación del arquetipo **límites al crecimiento**.

**[Abrir la visualización web](https://porter-ia-rodrix.rodrigonicolasbravoz.chatgpt.site)** · **[Repositorio público](https://github.com/Rodrix836/Avance-2-de-tic)**

El enlace de la visualización alojada puede requerir la sesión de su propietario. El código público puede descargarse y ejecutarse localmente sin cuentas ni claves.

### Qué puedes explorar

- **Mapa de fuerzas:** selecciona rivalidad, entrantes, proveedores, clientes o sustitutos para leer sus factores e implicaciones.
- **Arquetipo sistémico:** recorre los ciclos R1 de innovación, B1 de capacidad y B2 de competencia. Cada flecha muestra su signo y las demoras relevantes.
- **Síntesis y fuentes:** lectura para exposición, alcance del modelo y enlaces a las fuentes consultadas.

### Abrir en tu computadora

1. Descarga el repositorio con **Code → Download ZIP** y descomprímelo, o clónalo.
2. Abre **`dist/index.html`** con tu navegador.
3. No necesitas instalar dependencias. La navegación y los diagramas funcionan sin servidor.

También puedes servirlo con Python:

```bash
python -m http.server 8000 --directory dist
```

Después abre `http://localhost:8000`. Las fuentes tipográficas usan Google Fonts; sin conexión se utiliza la fuente local de respaldo. La consulta de fuentes bibliográficas requiere Internet.

### Estructura

| Archivo | Función |
|---|---|
| `dist/index.html` | Contenido, navegación, mapa de Porter y fuentes. |
| `dist/styles.css` | Diseño adaptable a computadoras y celulares. |
| `dist/app.js` | Datos del caso, selección de fuerzas y diagramas SVG causales. |
| `dist/favicon.svg` | Ícono del sitio. |
| `index.html` | Entrada alternativa que abre `dist/index.html`. |

HTML, CSS y JavaScript nativo. Sin base de datos, cuentas de usuario, llamadas a modelos de IA ni claves API.

### Modelo conceptual

Las cinco fuerzas de Porter son un marco de estructura competitiva. El arquetipo sistémico es una representación de retroalimentación. La aplicación los vincula, sin presentarlos como si fueran el mismo modelo.

| Ciclo | Secuencia causal | Tipo |
|---|---|---|
| R1 | Adopción → ingresos → reinversión → valor percibido → adopción. Todas las relaciones son positivas. | Refuerzo |
| B1 | Adopción → carga → saturación → calidad → adopción. Saturación → calidad es negativa. | Equilibrio |
| B2 | Adopción → atractivo del mercado → presión competitiva → margen reinvertible → valor relativo → adopción. Presión → margen es negativa. | Equilibrio |

**Lectura de signos:** `+` significa que, manteniendo lo demás constante, la variable destino cambia en la misma dirección; `−` indica dirección opuesta. No significan bueno o malo. `∥` indica demora. R y B describen la polaridad del ciclo, no garantizan crecimiento o estabilidad en cualquier situación.

**Supuestos:** R1 considera monetización, margen positivo y reinversión efectiva. B1 considera capacidad fija a corto plazo. B2 usa la adopción de un servicio como señal del crecimiento de su segmento y agrupa varias presiones; es una simplificación. La presión competitiva puede limitar el margen incluso con demanda creciente.

Las calificaciones Alta, Media-alta y Media son valoraciones didácticas del caso. Los ciclos son hipótesis, no relaciones empíricamente estimadas. No se calcula un índice numérico ni se realiza una simulación calibrada.

### Fuentes

1. Harvard Business School, Institute for Strategy and Competitiveness. [The Five Forces](https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx).
2. Daniel H. Kim, The Systems Thinker. [Using “Limits to Success” as a Planning Tool](https://thesystemsthinker.com/using-limits-to-success-as-a-planning-tool/).
3. Stanford HAI. [AI Index 2026: Research and Development](https://hai.stanford.edu/ai-index/2026-ai-index-report/research-and-development).

Consulta: 11 de septiembre de 2026. La interpretación del sector, los ejemplos y las relaciones propuestas son elaboración didáctica propia.
