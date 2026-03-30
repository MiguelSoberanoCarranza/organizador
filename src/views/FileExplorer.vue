<template>
  <div class="explorer-view">
    <header class="explorer-header">
      <div class="breadcrumb">
        <span @click="navigateTo(rootPath)" class="crumb">Inicio</span>
        <span v-for="(part, index) in breadcrumbs" :key="index" class="crumb-wrapper">
          <span class="sep">/</span>
          <span @click="navigateToPart(index)" class="crumb">{{ part }}</span>
        </span>
      </div>
    </header>

    <div class="explorer-container">
      <table class="explorer-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th class="text-right">Peso</th>
            <th class="text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          <!-- Botón de Retroceder -->
          <tr v-if="currentPath !== rootPath" @click="goUp" class="row-up">
            <td>
              <div class="name-cell">
                <span class="icon">📁</span> .. (Subir)
              </div>
            </td>
            <td>Carpeta</td>
            <td class="text-right">-</td>
            <td></td>
          </tr>

          <tr v-for="item in items" :key="item.path" @click="handleItemClick(item)" @dblclick="item.extension === 'folder' ? fetchItems(item.path) : openItem(item)" class="row-item">
            <td>
              <div class="name-cell">
                <span class="icon">{{ getFileIcon(item) }}</span>
                {{ item.name }}
              </div>
            </td>
            <td>{{ item.extension === 'folder' ? 'Carpeta' : (item.extension || '').toUpperCase().replace('.', '') || 'ARCHIVO' }}</td>
            <td class="text-right size-cell">{{ formatBytes(item.size) }}</td>
            <td class="text-center">
              <div class="actions-cell">
                <button v-if="item.extension === 'folder'" class="btn-action btn-enter" title="Entrar" @click.stop="fetchItems(item.path)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
                <button class="btn-action btn-location" title="Abrir Locación" @click.stop="showLocation(item)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </button>
                <button class="btn-action btn-move" title="Mover a carpeta específica" @click.stop="moveToFolder(item)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"></line><polyline points="10 5 19 5 19 14"></polyline></svg>
                </button>
                <button class="btn-action btn-trash" title="Mover a Papelera" @click.stop="moveToTrash(item)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
                <button class="btn-action btn-delete" title="Borrar Definitivo" @click.stop="deleteItem(item)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="items.length === 0" class="empty-state">
        <p v-if="!rootPath">No hay una selección activa. Escanea una carpeta primero.</p>
        <p v-else>No se encontraron archivos en este directorio.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const items = ref([])
const rootPath = ref('')
const currentPath = ref('')

const breadcrumbs = computed(() => {
    if (!rootPath.value || !currentPath.value) return []
    const relative = currentPath.value.replace(rootPath.value, '')
    return relative.split('\\').filter(p => p !== '')
})

const fetchItems = async (path) => {
    currentPath.value = path
    // @ts-ignore
    const result = await window.electronAPI.getFolderContents(path)
    // Sort: Folders first, then by size
    items.value = result.sort((a, b) => {
        if (a.extension === 'folder' && b.extension !== 'folder') return -1
        if (a.extension !== 'folder' && b.extension === 'folder') return 1
        return b.size - a.size
    })
}

onMounted(async () => {
    // @ts-ignore
    rootPath.value = await window.electronAPI.getRootPath()
    if (rootPath.value) {
        await fetchItems(rootPath.value)
    }
})

const handleItemClick = (item) => {
    if (item.extension === 'folder') {
        fetchItems(item.path)
    }
}

const navigateTo = (path) => fetchItems(path)

const navigateToPart = (index) => {
    const parts = currentPath.value.replace(rootPath.value, '').split('\\').filter(p => p !== '')
    const targetSubPath = parts.slice(0, index + 1).join('\\')
    fetchItems(rootPath.value + (targetSubPath ? '\\' + targetSubPath : ''))
}

const openItem = (item) => {
    // @ts-ignore
    window.electronAPI.openPath(item.path)
}

const showLocation = (item) => {
    // @ts-ignore
    window.electronAPI.showItemInFolder(item.path)
}

const moveToFolder = async (item) => {
    // @ts-ignore
    const targetFolder = await window.electronAPI.selectFolder();
    if (targetFolder) {
        // @ts-ignore
        const res = await window.electronAPI.moveItem(item.path, targetFolder);
        if (res && res.success) {
            items.value = items.value.filter(i => i.path !== item.path);
        } else {
            alert("No se pudo mover: " + (res?.error || "Error desconocido"));
        }
    }
}

const moveToTrash = async (item) => {
    // @ts-ignore
    const res = await window.electronAPI.trashItem(item.path);
    if (res && res.success === false) {
        alert("No se pudo enviar a la papelera. Posiblemente esté en uso por otro programa.\n\nError: " + res.error);
        return;
    }
    items.value = items.value.filter(i => i.path !== item.path)
}

const deleteItem = async (item) => {
    if (confirm(`¿Estás seguro de que quieres eliminar PERMANENTEMENTE "${item.name}"? Esta acción no se puede deshacer.`)) {
        // @ts-ignore
        const res = await window.electronAPI.deletePermanently(item.path)
        if (res && res.success === false) {
            alert("No se pudo borrar el archivo. Asegúrate de cerrarlo e inténtalo de nuevo.\n\nError: " + res.error);
            return;
        }
        items.value = items.value.filter(i => i.path !== item.path)
    }
}

const getFileIcon = (item) => {
    if (item.extension === 'folder') return '📁'
    if (!item.extension) return '📄'
    const ext = item.extension.toLowerCase()
    if (['.jpg', '.png', '.gif', '.webp'].includes(ext)) return '🖼️'
    if (['.mp4', '.mkv', '.mov'].includes(ext)) return '🎬'
    if (['.pdf', '.docx', '.txt', '.xlsx'].includes(ext)) return '📄'
    if (['.exe', '.msi', '.bat', '.cmd', '.iso', '.img'].includes(ext)) return '💿'
    if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return '📦'
    if (['.js', '.ts', '.vue', '.dart', '.py', '.java', '.cpp', '.c', '.cs', '.html', '.css', '.php', '.sql', '.sh', '.json', '.xml', '.yaml', '.md', '.go', '.rs'].includes(ext)) return '💻'
    return '📄'
}

const goUp = () => {
    const parts = currentPath.value.split('\\')
    parts.pop()
    fetchItems(parts.join('\\'))
}

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
</script>

<style scoped>
.explorer-view {
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid #334155;
  overflow: hidden;
}

.explorer-header {
  padding: 1rem 1.5rem;
  background: rgba(0,0,0,0.2);
  border-bottom: 1px solid #334155;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-dim);
}

.crumb {
  cursor: pointer;
  transition: color 0.2s;
}

.crumb:hover { color: var(--accent); }
.sep { margin: 0 0.5rem; opacity: 0.5; }

.explorer-container {
  width: 100%;
}

.explorer-table {
  width: 100%;
  border-collapse: collapse;
}

.explorer-table th {
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 0.8rem;
  color: var(--text-dim);
  text-transform: uppercase;
  background: rgba(255,255,255,0.02);
}

.explorer-table td {
  padding: 0.75rem 1.5rem;
  border-top: 1px solid #334155;
}

.row-item, .row-up {
  cursor: pointer;
  transition: background 0.2s;
}

.row-item:hover, .row-up:hover {
  background: rgba(56, 189, 248, 0.05);
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.icon { font-size: 1.2rem; }
.size-cell { font-family: monospace; color: var(--accent); font-weight: 600; }
.text-center { text-align: center; }
.actions-cell { display: flex; gap: 0.5rem; justify-content: center; }

.btn-action {
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255,255,255,0.05);
}

.btn-enter { color: var(--accent); background: rgba(56, 189, 248, 0.1); }
.btn-location { color: #a855f7; background: rgba(168, 85, 247, 0.1); }
.btn-move { color: #10b981; background: rgba(16, 185, 129, 0.1); }
.btn-trash { color: #facc15; background: rgba(250, 204, 21, 0.1); }
.btn-delete { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

.btn-action:hover {
  transform: translateY(-2px);
  filter: brightness(1.2);
}

.empty-state {
  padding: 4rem;
  text-align: center;
  color: var(--text-dim);
}
</style>
