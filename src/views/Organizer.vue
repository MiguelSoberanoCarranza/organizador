<template>
  <div class="organizer-view">
    <header class="section-header">
      <h2>Organizador Inteligente</h2>
      <p class="subtitle">Agrupa tus archivos dispersos en carpetas ordenadas por categoría.</p>
    </header>

    <div class="category-grid">
      <div v-for="(count, cat) in categories" :key="cat" class="cat-card">
        <div class="cat-icon">{{ getIcon(cat) }}</div>
        <div class="cat-info">
          <h3>{{ cat }}</h3>
          <span>{{ count }} archivos</span>
        </div>
      </div>
    </div>

    <div class="action-panel">
        <div class="strategy-card" v-if="plan.length > 0 || isOrganizing">
            <h3>Estrategia Sugerida: Clasificar Raíz</h3>
            <p>Se moverán {{ selectedItems.length }} ítems (de {{ plan.length }}) de la carpeta raíz a sus subcarpetas correspondientes.</p>
            
            <div v-if="isOrganizing" class="progress-section">
                <div class="progress-info">
                    <span>Moviendo: {{ currentAction.name }}</span>
                    <span>{{ currentAction.current }} / {{ currentAction.total }}</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" :style="{ width: (currentAction.current / currentAction.total * 100) + '%' }"></div>
                </div>
            </div>

            <div v-if="plan.length > 0 && !isOrganizing" class="preview-table-container">
                <table class="preview-table">
                    <thead>
                        <tr>
                            <th style="width: 40px; text-align: center;"><input type="checkbox" @change="toggleAll" :checked="plan.length > 0 && selectedItems.length === plan.length" /></th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Peso</th>
                            <th>Hacia</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in plan" :key="item.source" :class="{'selected-row': selectedItems.includes(item.source)}">
                            <td class="text-center">
                                <input type="checkbox" :value="item.source" v-model="selectedItems" />
                            </td>
                            <td class="name-cell" @click="toggleSelection(item.source)" style="cursor: pointer;">{{ item.name }}</td>
                            <td @click="toggleSelection(item.source)" style="cursor: pointer;"><span class="type-badge">{{ item.type }}</span></td>
                            <td class="size-cell" @click="toggleSelection(item.source)" style="cursor: pointer;">{{ formatBytes(item.size) }}</td>
                            <td class="dest-cell">
                                <select v-model="item.category" @click.stop class="cat-select">
                                    <option v-for="cat in allCategories" :key="cat" :value="cat">{{ cat }}</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="warning-box" v-if="plan.length > 0">
                ⚠️ Esto moverá los archivos físicos seleccionados. ¡Revisa tu selección y dale al botón!
            </div>
            
            <button @click="startOrganize" class="btn btn-hero" :disabled="isOrganizing || selectedItems.length === 0">
                {{ isOrganizing ? 'Organizando...' : '¡Ejecutar elementos seleccionados!' }}
            </button>
        </div>
        <div class="strategy-card empty-state" v-else>
            <h3>No hay archivos para organizar</h3>
            <p>No se encontraron datos. Por favor, realiza un escaneo nuevo desde el menú <strong>Dashboard</strong> para poder generar y visualizar un plan de organización.</p>
        </div>
    </div>

    <div v-if="history.length > 0" class="mini-history">
        <h4>Acciones recientes</h4>
        <div v-for="h in history" :key="h.id" class="history-item">
            ✅ Movido: {{ h.source_path.split('\\').pop() }} ➔ {{ h.target_path.split('\\').pop() }}
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const categories = ref({})
const allCategories = ref([])
const plan = ref([])
const selectedItems = ref([])
const isOrganizing = ref(false)
const currentAction = ref({ current: 0, total: 0, name: '' })
const history = ref([])

const toggleAll = (e) => {
    if (e.target.checked) selectedItems.value = plan.value.map(i => i.source)
    else selectedItems.value = []
}

const toggleSelection = (source) => {
    if (selectedItems.value.includes(source)) {
        selectedItems.value = selectedItems.value.filter(s => s !== source)
    } else {
        selectedItems.value.push(source)
    }
}

const refresh = async () => {
    // @ts-ignore
    const stats = await window.electronAPI.getCategoryStats()
    categories.value = stats
    
    // @ts-ignore
    const catalog = await window.electronAPI.getCatalog()
    allCategories.value = [...Object.keys(catalog), 'Otros']

    // @ts-ignore
    const dbStats = await window.electronAPI.getStats()
    if (!dbStats || dbStats.totalFiles === 0) {
        plan.value = []
        selectedItems.value = []
        return
    }

    // @ts-ignore
    plan.value = await window.electronAPI.getOrganizationPreview() || []
    selectedItems.value = plan.value.map(i => i.source)
}

onMounted(() => {
    refresh()
    // @ts-ignore
    window.electronAPI.onOrganizeProgress((event, data) => {
        currentAction.value = data
    })
})

const startOrganize = async () => {
    if (selectedItems.value.length === 0) return
    if (!confirm(`¿Seguro que quieres mover ${selectedItems.value.length} archivos a sus carpetas de categoría?`)) return
    isOrganizing.value = true
    // Create custom plan with user corrections
    const customPlan = plan.value
        .filter(i => selectedItems.value.includes(i.source))
        .map(i => ({ source: i.source, category: i.category, name: i.name }))

    // @ts-ignore
    await window.electronAPI.organizeByCategory(JSON.parse(JSON.stringify(customPlan)))
    await refresh()
    isOrganizing.value = false
}

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const getIcon = (cat) => {
    const icons = {
        'Imágenes': '🖼️',
        'Videos': '🎬',
        'Documentos': '📄',
        'Software': '💻',
        'Imágenes de Disco': '💿',
        'Videojuegos': '🎮',
        'Comprimidos': '📦',
        'Código': '📁',
        'Otros': '📄'
    }
    return icons[cat] || '📁'
}
</script>

<style scoped>
.organizer-view { padding-bottom: 4rem; }
.subtitle { color: var(--text-dim); margin-top: 0.5rem; margin-bottom: 2rem; }
.category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
.cat-card { background: var(--bg-card); padding: 1.5rem; border-radius: 12px; border: 1px solid #334155; display: flex; align-items: center; gap: 1rem; }
.cat-icon { font-size: 2rem; }
.cat-info h3 { margin: 0; font-size: 1.1rem; }
.cat-info span { font-size: 0.85rem; color: var(--text-dim); }

.action-panel { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 2rem; border-radius: 16px; border: 1px solid var(--accent); position: relative; overflow: hidden; }
.strategy-card h3 { margin-top: 0; }
.empty-state { text-align: center; padding: 2rem; color: #94a3b8; }
.empty-state h3 { color: #f1f5f9; margin-bottom: 0.5rem; }
.warning-box { background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 1rem; margin: 1.5rem 0; color: #fcd34d; font-size: 0.9rem; }
.btn-hero { width: 100%; padding: 1.2rem; font-size: 1.1rem; font-weight: 700; background: var(--accent); border-radius: 12px; transition: transform 0.2s; }
.btn-hero:hover { transform: scale(1.02); background: #3b82f6; }

.mini-history { margin-top: 3rem; }
.history-item { font-size: 0.85rem; color: var(--text-dim); padding: 0.5rem 0; border-bottom: 1px dashed #334155; }

.preview-table-container { max-height: 250px; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 8px; margin: 1rem 0; font-size: 0.85rem; border: 1px solid #334155; }
.preview-table { width: 100%; border-collapse: collapse; }
.preview-table th { text-align: left; padding: 0.75rem; background: rgba(255,255,255,0.05); color: var(--text-dim); }
.preview-table td { padding: 0.6rem 0.75rem; border-top: 1px solid #334155; }
.selected-row { background: rgba(56, 189, 248, 0.05); }
.name-cell { font-family: monospace; color: var(--accent); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }
.size-cell { font-size: 0.8rem; color: var(--text-dim); text-align: right; padding-right: 1.5rem !important; }
.type-badge { background: #334155; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; }
.dest-cell { padding-right: 0.5rem !important; }
.cat-select { 
    background: rgba(30, 58, 138, 0.2); 
    color: #60a5fa; 
    border: 1px solid rgba(96, 165, 250, 0.3);
    border-radius: 6px; 
    padding: 0.2rem 0.5rem; 
    font-size: 0.75rem; 
    cursor: pointer;
    outline: none;
    width: 100%;
}
.cat-select option {
    background: #0f172a;
    color: #60a5fa;
}
.cat-select:focus { border-color: #60a5fa; }
.dest-badge { background: #1e3a8a; color: #60a5fa; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; }

.progress-section { margin: 2rem 0; }
.progress-info { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--text-dim); }
.progress-bar-bg { background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden; }
.progress-bar-fill { background: var(--accent); height: 100%; transition: width 0.3s ease; box-shadow: 0 0 10px var(--accent); }
</style>
