// CRM + 2do Cerebro - App Principal
// Estilo retro pixel colorido

// ============ DATOS ============
const STORAGE_KEYS = {
  CONTACTS: 'crm_contacts',
  TASKS: 'crm_tasks',
  NOTES: 'brain_notes'
};

// Estado global
let contacts = [];
let tasks = [];
let notes = [];
let currentTab = 'crm';
let selectedContactId = null;
let selectedNoteId = null;

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initTabs();
  initCRM();
  initBrain();
  initGraph();
  initGlobalSearch();
  renderAll();
});

function loadData() {
  const savedContacts = localStorage.getItem(STORAGE_KEYS.CONTACTS);
  const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
  const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);

  contacts = savedContacts ? JSON.parse(savedContacts) : [];
  tasks = savedTasks ? JSON.parse(savedTasks) : [];
  notes = savedNotes ? JSON.parse(savedNotes) : seedNotes();

  // Seed inicial si no hay datos
  if (contacts.length === 0) contacts = seedContacts();
  if (tasks.length === 0) tasks = seedTasks();
}

function seedContacts() {
  return [
    {
      id: genId(),
      name: 'Mauricio Díaz',
      email: 'agrolara00@gmail.com',
      phone: '+56 9 1234 5678',
      company: 'Agrolara',
      tags: ['cliente', 'amigo'],
      notes: 'Interesado en automatizaciones. Usa [[Pluribus]] como serie favorita.'
    },
    {
      id: genId(),
      name: 'Carlos Riquelme',
      email: 'criquelme@mhn.cl',
      phone: '+56 9 8765 4321',
      company: 'Museo de Historia Natural',
      tags: ['colega', 'mentor'],
      notes: 'Paleontólogo. Colabora en proyecto de libro. Ver [[El Viaje en el Tiempo de los Lara]].'
    },
    {
      id: genId(),
      name: 'Eugenio Guía',
      email: 'eugenio@sanpedro.cl',
      phone: '+56 9 1111 2222',
      company: 'Tourismo San Pedro',
      tags: ['proveedor'],
      notes: 'Guía en Atacama. Conoce la zona de la máquina.'
    }
  ];
}

function seedTasks() {
  return [
    { id: genId(), title: 'Revisar correos pendientes', done: false, due: '2026-03-05', contactId: null },
    { id: genId(), title: 'Llamar a Carlos Riquelme', done: false, due: '2026-03-06', contactId: null },
    { id: genId(), title: 'Actualizar notas de proyecto', done: true, due: '2026-03-04', contactId: null },
    { id: genId(), title: 'Preparar backup semanal', done: false, due: '2026-03-07', contactId: null }
  ];
}

function seedNotes() {
  return [
    {
      id: genId(),
      title: 'Pluribus',
      content: 'Serie de Apple TV+ creada por Vince Gilligan. Post-apocalíptica, mente colmena.\n\nProtagonista: Carol Sturka (Rhea Seehorn).\n\nTemática: IA, libre albedrío, felicidad vs individualidad.\n\nRelacionada: [[El Viaje en el Tiempo de los Lara]] (similar conflicto: máquina del tiempo vs libre albedrío).',
      date: new Date().toISOString()
    },
    {
      id: genId(),
      title: 'El Viaje en el Tiempo de los Lara',
      content: 'Libro en progreso sobre familia chilena que viaja al Cretácico.\n\nPersonajes: Mauricio, Dante, Máximo, Abuela Raquel, Tata Héctor.\n\nTemas: ética temporal, dinosaurios chilenos (Stegouros, Megaraptor).\n\nVer también: [[Proyecto Libro Checklist]] y [[Kali Linux]] (herramientas futuras).',
      date: new Date().toISOString()
    },
    {
      id: genId(),
      title: 'Proyecto Libro Checklist',
      content: '- [x] Capítulo 1 completado\n- [x] Capítulo 2 completado\n- [ ] Capítulo 3 en progreso\n- [ ] Revisión editorial\n- [ ] Diseño de portada\n\nNecesita: feedback de [[Carlos Riquelme]] (experto paleontología).',
      date: new Date().toISOString()
    },
    {
      id: genId(),
      title: 'Kali Linux',
      content: 'Herramientas de auditoría de seguridad planificadas:\n- nmap\n- metasploit-framework\n- sqlmap\n- john\n- wireshark\n\n⚠️ Solo para sistemas autorizados.\n\nRelacionado: [[Backup OpenClaw]] (seguridad).',
      date: new Date().toISOString()
    },
    {
      id: genId(),
      title: 'Backup OpenClaw',
      content: 'Sistema de backup diario automático:\n- Script: backup_openclaw_daily.sh\n- Hora: 12:00 UTC\n- Entrega: Telegram\n- Retención: manual\n\nRestauración: restore_openclaw.sh\n\nVer: [[Kali Linux]] (seguridad del sistema).',
      date: new Date().toISOString()
    }
  ];
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveData() {
  localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

// ============ TABS ============
function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(`${tabId}-tab`).classList.add('active');

  // Mostrar/ocultar canvas de grafos
  const canvas = document.getElementById('graph-canvas');
  if (canvas) {
    if (tabId === 'brain') canvas.classList.remove('hidden');
    else canvas.classList.add('hidden');
  }
}

// ============ CRM ============
function initCRM() {
  document.getElementById('add-contact-btn').addEventListener('click', openContactModal);
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('contact-form').addEventListener('submit', handleContactSubmit);
}

function renderCRM() {
  renderContactList();
  renderTaskList();
}

function renderContactList() {
  const list = document.getElementById('contact-list');
  list.innerHTML = '';
  contacts.forEach(c => {
    const item = document.createElement('li');
    item.className = `contact-item${selectedContactId === c.id ? ' selected' : ''}`;
    item.dataset.id = c.id;
    item.innerHTML = `
      <span class="item-name">${escapeHtml(c.name)}</span>
      <span class="item-company">${escapeHtml(c.company || '')}</span>
      <span class="item-tags">${c.tags.map(t => `[${t}]`).join(' ')}</span>
    `;
    item.addEventListener('click', () => selectContact(c.id));
    list.appendChild(item);
  });
}

function renderTaskList() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  tasks.forEach(t => {
    const item = document.createElement('li');
    item.className = `task-item${t.done ? ' task-done' : ''}`;
    item.dataset.id = t.id;
    item.innerHTML = `
      <input type="checkbox" class="task-check" ${t.done ? 'checked' : ''}>
      <span class="task-text">${escapeHtml(t.title)}</span>
      <span class="task-due">${t.due ? t.due.slice(5) : ''}</span>
    `;
    item.querySelector('.task-check').addEventListener('change', () => toggleTask(t.id));
    list.appendChild(item);
  });
}

function selectContact(id) {
  selectedContactId = id;
  renderContactList();
  renderContactDetail();
}

function renderContactDetail() {
  const panel = document.getElementById('contact-detail');
  if (!selectedContactId) {
    panel.innerHTML = '<div class="empty-state">Selecciona un contacto para ver detalles</div>';
    return;
  }

  const contact = contacts.find(c => c.id === selectedContactId);
  if (!contact) return;

  // Procesar notas con backlinks
  const processedNotes = processBacklinks(contact.notes || '', 'crm-contact');

  panel.innerHTML = `
    <div class="contact-detail">
      <h3>${escapeHtml(contact.name)}</h3>
      <div class="detail-field">
        <label>Empresa</label>
        <div class="value">${escapeHtml(contact.company || 'N/A')}</div>
      </div>
      <div class="detail-field">
        <label>Email</label>
        <div class="value"><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email || 'N/A')}</a></div>
      </div>
      <div class="detail-field">
        <label>Teléfono</label>
        <div class="value"><a href="tel:${escapeHtml(contact.phone)}">${escapeHtml(contact.phone || 'N/A')}</a></div>
      </div>
      <div class="detail-field">
        <label>Etiquetas</label>
        <div class="value">${contact.tags.map(t => `<span style="color:var(--accent-orange)">[${t}]</span>`).join(' ')}</div>
      </div>
      <div class="detail-field">
        <label>Notas</label>
        <div class="value markdown-preview">${processedNotes}</div>
      </div>
    </div>
  `;
}

function openContactModal() {
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const tags = formData.get('tags').split(',').map(t => t.trim()).filter(t => t);

  const newContact = {
    id: genId(),
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),
    tags,
    notes: formData.get('notes')
  };

  contacts.push(newContact);
  saveData();
  renderCRM();
  closeModal();
  form.reset();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveData();
    renderTaskList();
  }
}

// ============ 2do CEREBRO ============
function initBrain() {
  document.getElementById('new-note-btn').addEventListener('click', createNewNote);
  document.getElementById('save-note-btn').addEventListener('click', saveCurrentNote);
  document.getElementById('toggle-graph-btn').addEventListener('click', toggleGraph);

  const editor = document.getElementById('note-editor');
  editor.addEventListener('input', updatePreview);
  editor.addEventListener('keydown', handleEditorKeydown);

  // Botones de toolbar
  document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.command;
      execEditorCommand(cmd);
    });
  });
}

function execEditorCommand(cmd) {
  const editor = document.getElementById('note-editor');
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const text = editor.value;

  switch (cmd) {
    case 'bold':
      editor.value = text.slice(0, start) + '**' + text.slice(start, end) + '**' + text.slice(end);
      break;
    case 'italic':
      editor.value = text.slice(0, start) + '_' + text.slice(start, end) + '_' + text.slice(end);
      break;
    case 'heading':
      editor.value = text.slice(0, start) + '## ' + text.slice(start);
      break;
    case 'link':
      editor.value = text.slice(0, start) + '[[' + text.slice(start, end) + ']]' + text.slice(end);
      break;
    case 'code':
      editor.value = text.slice(0, start) + '`' + text.slice(start, end) + '`' + text.slice(end);
      break;
  }

  editor.focus();
  editor.selectionStart = start + 2;
  editor.selectionEnd = end + 2;
  updatePreview();
}

function handleEditorKeydown(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    document.execCommand('insertText', false, '  ');
  }
}

function renderBrain() {
  const list = document.getElementById('note-list');
  list.innerHTML = '';
  notes.forEach(n => {
    const item = document.createElement('li');
    item.className = `note-item${selectedNoteId === n.id ? ' selected' : ''}`;
    item.dataset.id = n.id;
    item.innerHTML = `
      <span class="note-title">${escapeHtml(n.title || 'Sin título')}</span>
      <span class="note-date">${new Date(n.date).toLocaleDateString('es-CL')}</span>
    `;
    item.addEventListener('click', () => selectNote(n.id));
    list.appendChild(item);
  });
}

function createNewNote() {
  const newNote = {
    id: genId(),
    title: 'Nueva nota',
    content: '',
    date: new Date().toISOString()
  };
  notes.unshift(newNote);
  selectNote(newNote.id);
  saveData();
}

function selectNote(id) {
  selectedNoteId = id;
  renderBrain();

  const note = notes.find(n => n.id === id);
  if (note) {
    document.getElementById('note-editor').value = note.content;
    updatePreview();
  }
}

function saveCurrentNote() {
  if (!selectedNoteId) return;
  const editor = document.getElementById('note-editor');
  const note = notes.find(n => n.id === selectedNoteId);
  if (note) {
    note.content = editor.value;
    // Extraer título de la primera línea no vacía
    const firstLine = note.content.split('\n')[0].trim().replace(/^#+\s*/, '');
    if (firstLine) note.title = firstLine;
    note.date = new Date().toISOString();
    saveData();
    renderBrain();
    updateGraph(); // actualizar grafos
  }
}

function updatePreview() {
  const editor = document.getElementById('note-editor');
  const content = editor.value;
  const preview = document.getElementById('note-preview');
  const backlinksList = document.getElementById('preview-backlinks');

  // Procesar backlinks con colores
  const processed = processBacklinks(content, 'all');
  preview.innerHTML = processed;

  // Extraer backlinks y mostrarlos lista
  const backlinks = extractBacklinks(content);
  backlinksList.innerHTML = '';
  backlinks.forEach(link => {
    const li = document.createElement('li');
    const exists = notes.find(n => n.title.toLowerCase() === link.toLowerCase()) ||
                   contacts.find(c => c.name.toLowerCase() === link.toLowerCase());
    li.innerHTML = `<span class="backlink ${exists ? 'existent' : 'missing'}">[[${escapeHtml(link)}]]</span> → ${exists ? '✓ Existe' : '✗ Crear?'}`;
    backlinksList.appendChild(li);
  });

  // Actualizar lista de backlinks en sidebar
  updateSidebarBacklinks(backlinks);
}

function extractBacklinks(text) {
  const regex = /\[\[([^\]]+)\]\]/g;
  const links = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    links.push(match[1]);
  }
  return [...new Set(links)]; // únicos
}

function processBacklinks(text, type) {
  // Convertir markdown simple a HTML
  let html = escapeHtml(text);

  // Encabezados
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Negrita
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Cursiva
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  // Código inline
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  // Saltos de línea
  html = html.replace(/\n/g, '<br>');

  // Backlinks coloridos
  const backlinks = extractBacklinks(text);
  const processed = html;

  // Reemplazar backlinks con spans coloridos
  const result = processed.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
    const link = p1.trim();
    const isContact = contacts.some(c => c.name.toLowerCase() === link.toLowerCase());
    const isNote = notes.some(n => n.title.toLowerCase() === link.toLowerCase());

    let cssClass = 'missing';
    if (isNote) cssClass = 'existent';
    else if (isContact) cssClass = 'crm-contact';

    return `<span class="backlink ${cssClass}" data-link="${escapeHtml(link)}">[[${escapeHtml(link)}]]</span>`;
  });

  return result;
}

function updateSidebarBacklinks(backlinks) {
  const list = document.getElementById('backlink-list');
  list.innerHTML = '';
  backlinks.slice(0, 10).forEach(link => {
    const li = document.createElement('li');
    const isNote = notes.find(n => n.title.toLowerCase() === link.toLowerCase());
    const isContact = contacts.find(c => c.name.toLowerCase() === link.toLowerCase());
    li.innerHTML = `
      <a href="#" data-type="${isNote ? 'note' : isContact ? 'contact' : 'create'}" data-link="${escapeHtml(link)}">
        ${escapeHtml(link)}
      </a>
    `;
    li.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      navigateBacklink(link, isNote ? 'note' : isContact ? 'contact' : 'create');
    });
    list.appendChild(li);
  });
}

function navigateBacklink(link, type) {
  if (type === 'note') {
    const note = notes.find(n => n.title.toLowerCase() === link.toLowerCase());
    if (note) selectNote(note.id);
    switchTab('brain');
  } else if (type === 'contact') {
    const contact = contacts.find(c => c.name.toLowerCase() === link.toLowerCase());
    if (contact) {
      switchTab('crm');
      selectContact(contact.id);
    }
  } else {
    // Crear nueva nota
    switchTab('brain');
    createNewNote();
    setTimeout(() => {
      const editor = document.getElementById('note-editor');
      editor.value = `# ${link}\n\n`;
      saveCurrentNote();
    }, 50);
  }
}

function toggleGraph() {
  const graphTab = document.getElementById('graph-tab');
  const tabBtn = document.querySelector('[data-tab="graph"]');
  if (currentTab === 'graph') {
    switchTab('brain');
  } else {
    switchTab('graph');
  }
}

// ============ GRAFO DE CONOCIMIENTO ============
let graphCtx = null;
let graphCanvas = null;

function initGraph() {
  graphCanvas = document.getElementById('main-graph-canvas');
  graphCtx = graphCanvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    updateGraph();
  });
  document.getElementById('regenerate-graph').addEventListener('click', updateGraph);
  document.getElementById('export-graph').addEventListener('click', exportGraph);
}

function resizeCanvas() {
  const container = graphCanvas.parentElement;
  graphCanvas.width = container.clientWidth;
  graphCanvas.height = container.clientHeight;
}

let graphNodes = [];
let graphEdges = [];

function updateGraph() {
  if (!graphCtx) return;

  // Construir nodos: contactos + notas
  graphNodes = [];
  graphEdges = [];

  // Agregar contactos
  contacts.forEach(c => {
    graphNodes.push({
      id: c.id,
      type: 'contact',
      label: c.name,
      x: 0,
      y: 0,
      color: '#58a6ff'
    });
  });

  // Agregar notas
  notes.forEach(n => {
    graphNodes.push({
      id: n.id,
      type: 'note',
      label: n.title || 'Sin título',
      x: 0,
      y: 0,
      color: '#3fb950'
    });
  });

  // Detectar enlaces entre notas (backlinks)
  notes.forEach(source => {
    const backlinks = extractBacklinks(source.content);
    backlinks.forEach(link => {
      const target = notes.find(n => n.title.toLowerCase() === link.toLowerCase());
      if (target) {
        graphEdges.push({
          from: source.id,
          to: target.id,
          type: 'backlink'
        });
      }
    });
  });

  // Detectar enlaces nota->contacto
  notes.forEach(note => {
    const backlinks = extractBacklinks(note.content);
    backlinks.forEach(link => {
      const contact = contacts.find(c => c.name.toLowerCase() === link.toLowerCase());
      if (contact) {
        graphEdges.push({
          from: note.id,
          to: contact.id,
          type: 'mention'
        });
      }
    });
  });

  // Layout simple (fuerza-directed básico)
  applyForceLayout();

  // Dibujar
  drawGraph();
}

function applyForceLayout() {
  const width = graphCanvas.width;
  const height = graphCanvas.height;
  const iterations = 100;

  // Posición inicial aleatoria
  graphNodes.forEach(node => {
    node.x = Math.random() * width;
    node.y = Math.random() * height;
  });

  for (let i = 0; i < iterations; i++) {
    // Repulsión entre todos los nodos
    for (let a = 0; a < graphNodes.length; a++) {
      for (let b = a + 1; b < graphNodes.length; b++) {
        const dx = graphNodes[b].x - graphNodes[a].x;
        const dy = graphNodes[b].y - graphNodes[a].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 1000 / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        graphNodes[a].x -= fx;
        graphNodes[a].y -= fy;
        graphNodes[b].x += fx;
        graphNodes[b].y += fy;
      }
    }

    // Atracción por enlaces
    graphEdges.forEach(edge => {
      const source = graphNodes.find(n => n.id === edge.from);
      const target = graphNodes.find(n => n.id === edge.to);
      if (!source || !target) return;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ideal = 100;
      const force = (dist - ideal) * 0.05;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      source.x += fx;
      source.y += fy;
      target.x -= fx;
      target.y -= fy;
    });

    // Mantener dentro de bounds
    graphNodes.forEach(node => {
      node.x = Math.max(20, Math.min(width - 20, node.x));
      node.y = Math.max(20, Math.min(height - 20, node.y));
    });
  }
}

function drawGraph() {
  const ctx = graphCtx;
  const width = graphCanvas.width;
  const height = graphCanvas.height;

  // Limpiar
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, width, height);

  // Dibujar enlaces
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 2;
  graphEdges.forEach(edge => {
    const source = graphNodes.find(n => n.id === edge.from);
    const target = graphNodes.find(n => n.id === edge.to);
    if (!source || !target) return;
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
  });

  // Dibujar nodos
  graphNodes.forEach(node => {
    // Círculo
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = node.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Texto
    ctx.fillStyle = '#c9d1d9';
    ctx.font = '12px VT323, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const words = node.label.split(' ');
    let y = node.y + 35;
    words.forEach(word => {
      ctx.fillText(word, node.x, y);
      y += 14;
    });
  });
}

function exportGraph() {
  const link = document.createElement('a');
  link.download = 'grafo-conocimiento.png';
  link.href = graphCanvas.toDataURL('image/png');
  link.click();
}

// ============ BÚSQUEDA GLOBAL ============
function initGlobalSearch() {
  const input = document.getElementById('global-search');
  input.addEventListener('input', debounce(e => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) return;

    const results = searchAll(query);
    console.log('Search results:', results); // Podría mostrar en un dropdown
  }, 300));
}

function searchAll(query) {
  const results = {
    contacts: contacts.filter(c => c.name.toLowerCase().includes(query) || c.company?.toLowerCase().includes(query)),
    tasks: tasks.filter(t => t.title.toLowerCase().includes(query)),
    notes: notes.filter(n => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query))
  };
  return results;
}

// ============ UTILIDADES ============
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function renderAll() {
  renderCRM();
  renderBrain();
  updatePreview();
  updateGraph();
}

// ============ EXPORTAR/IMPORTAR (opcional) ============
function exportData() {
  const data = { contacts, tasks, notes };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'crm-brain-backup.json';
  a.click();
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      contacts = data.contacts || [];
      tasks = data.tasks || [];
      notes = data.notes || [];
      saveData();
      renderAll();
      alert('¡Datos importados exitosamente!');
    } catch (err) {
      alert('Error al importar: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// Exponer funciones globales para HTML inline
window.exportData = exportData;
window.importData = importData;
