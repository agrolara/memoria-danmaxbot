# 🧠 CRM + 2do Cerebro - Sistema Integrado

Aplicación web completa de gestión de contactos/tareas y Knowledge Graph con backlinks coloridos. Todo en una sola página, estilo retro pixel.

---

## 🎨 Características

### 📇 **CRM**
- Contactos con etiquetas, email, teléfono, empresa
- Notas por contacto con **backlinks** `[[Nota]]`
- Tareas pendientes (checkbox, fechas)
- Búsqueda unificada

### 🧠 **2do Cerebro**
- Editor Markdown simple con botones de formato
- **Backlinks automáticos** con detección de notas existentes:
  - **Verde** `[[...]]` → Nota existente (click para navegar)
  - **Rojo** `[[...]]` → Nota faltante (click para crear)
  - **Azul** `[[...]]` → Contacto CRM
-lista de backlinks activos en tiempo real
- Vista previa renderizada

### 🌐 **Grafos de Conocimiento**
- Visualización interactiva de relaciones entre notas y contactos
- Layout force-directed (simulación física)
- Nodos coloridos por tipo
- Exportar como PNG

### 🎮 **Estética Retro Pixel**
- Fuentes: `Press Start 2P`, `VT323`, `Pixelify Sans`
- Colores oscuros con acentos neón (verde, azul, rojo, amarillo, púrpura)
- Scrollbars personalizados
- Bordes y sombras 2px (estilo pixelado)
- Responsive (adaptable a móvil)

---

## 🚀 Cómo usar

### Opción 1: Abrir directamente
Simplemente abre `index.html` en tu navegador (doble clic). Funciona sin servidor.

### Opción 2: Servidor local (recomendado)
```bash
cd /home/ubuntu/.openclaw/workspace/crm-brain
node server.js 3000
```
Abre: http://localhost:3000

---

## 📂 Estructura del proyecto

```
crm-brain/
├── index.html          # Aplicación principal (SPA)
├── css/
│   └── style.css       # Estilos retro pixel (~12 KB)
├── js/
│   └── app.js          # Lógica completa (~24 KB)
├── data/
│   └── seed.json       # Datos de ejemplo
├── server.js           # Servidor estático Node.js
└── README.md           # Este archivo
```

---

## 🎯 Uso rápido

### CRM
- Haz clic en **"📇 CRM"** en la barra lateral
- **+ Nuevo Contacto** → llena el formulario
- Usa `[[nombre-nota]]` en el campo de notas para crear backlinks
- Selecciona un contacto para ver sus detalles y backlinks renderizados
- Tareas: checkbox para marcar completadas

### 2do Cerebro
- Pestaña **"🧠 2do Cerebro"**
- **📝 Nueva Nota** crea una nota vacía
- Editor: escribe en Markdown. Usa `[[otra-nota]]` para vincular
- Botones de formato: **B** (negrita), *I* (cursiva), H (encabezado), 🔗 (backlink), `</>` (código)
- **Vista previa** muestra los backlinks **coloridos** y renderizados
- **Backlinks activos** en la barra lateral (máx. 10) → click para navegar/crear

### Grafos
- Pestaña **"🕸️ Grafos"** o botón **Mostrar/Ocultar Grafos** en 2do Cerebro
- Nodos verdes = notas, azules = contactos
- Líneas = relaciones (backlinks o menciones)
- 🔄 Regenerar (recalcula layout)
- 📤 Exportar (descarga PNG del grafo)

---

## 🔗 Sintaxis de backlinks

```
[[Nombre de la nota]]          → backlink a nota
[[Carlos Riquelme]]           → backlink a contacto (se detecta automáticamente)
[[nueva-idea]]                → se muestra en rojo (no existe) → clic para crear
```

**Nota:** No requiere espacio después de `[[`. Los títulos/contactos se comparan en minúsculas.

---

## 💾 Almacenamiento

Todo se guarda en **localStorage** del navegador:
- `crm_contacts`
- `crm_tasks`
- `brain_notes`

### Exportar/Importar manual
Abre la consola del navegador (F12) y ejecuta:

```javascript
// Exportar todos los datos
exportData(); // descarga JSON

// Importar (tras seleccionar un archivo)
importData(archivo);
```

Funciones disponibles globalmente en `window`.

---

## 🎨 Colores retro

| Color | Uso |
|-------|-----|
| Verde `#3fb950` | Backlink a nota existente |
| Rojo `#f85149` | Backlink faltante (broken) |
| Azul `#58a6ff` | Contactos CRM |
| Amarillo `#d29922` | Encabezados, títulos |
| Púrpura `#a371f7` | Etiquetas, bordes activos |
| Cyan `#39c5cf` | Enlaces, acentos |

---

## 📱 Responsive

- **Escritorio:** 3-columnas en CRM, 3-paneles en 2do Cerebro
- **Tablet:** 2-columnas
- **Móvil:** Todo en columna única (sidebar se desplaza horizontal)

---

## 🔧 Personalización

### Cambiar colores
Edita `:root` en `css/style.css`.

### Agregar más campos al CRM
Modifica el formulario en `index.html` y el objeto contacto en `js/app.js`.

### Cambiar fuente retro
Añade/elimina importaciones de Google Fonts en `style.css`.

---

## 📄 Licencia

MIT. Crea, modifica, usa libremente.

---

## 🧑‍💻 Autor

danmaxbot – Asistente OpenClaw  
Sistema generado el 5 de marzo de 2026
