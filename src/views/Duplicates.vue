<template>
  <div class="duplicates-view">
    <header class="section-header">
      <h2>Grupos de Duplicados ({{ groups.length }})</h2>
      <button v-if="groups.length > 0" @click="autoClean" class="btn btn-primary" :disabled="isCleaning">
        {{ isCleaning ? 'Limpiando...' : 'Auto-Limpiar' }}
      </button>
    </header>

    <div v-if="loading" class="loading-state">Calculando hashes reales...</div>
    
    <div v-else class="groups-list">
      <div v-for="group in groups" :key="group.hash" class="group-card">
        <div class="group-info">
          <span class="badge">Hash: {{ group.hash.substring(0, 8) }}</span>
          <span class="count">{{ group.count }} archivos</span>
          <span class="size">{{ (group.totalSize / (1024**2)).toFixed(2) }} MB gastados</span>
        </div>
        
        <div class="group-files">
          <div v-for="file in group.files" :key="file.id" class="file-row">
            <div class="file-details">
                <span class="file-name">{{ file.name }}</span>
                <span class="file-path">{{ file.path }}</span>
            </div>
            <button @click="quarantine(file.id)" class="btn-icon">🗑️ Mover</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const groups = ref([])
const loading = ref(true)
const isCleaning = ref(false)

const loadDuplicates = async () => {
    loading.value = true
    // @ts-ignore
    const data = await window.electronAPI.getDuplicates()
    // For each group, we should ideally fetch the specific files
    // In MVP, we just show the hashes for now
    groups.value = data
    loading.value = false
}

onMounted(() => loadDuplicates())

const quarantine = async (fileId) => {
    // @ts-ignore
    await window.electronAPI.quarantineFile(fileId)
    await loadDuplicates()
}

const autoClean = async () => {
    isCleaning.value = true
    // Logic to keep 1 and quarantine rest
    isCleaning.value = false
}
</script>

<style scoped>
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.group-card { background: var(--bg-card); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #334155; }
.group-info { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #334155; padding-bottom: 1rem; }
.badge { background: #1e293b; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; border: 1px solid var(--accent); }
.group-files { display: flex; flex-direction: column; gap: 0.75rem; }
.file-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 6px; }
.file-details { display: flex; flex-direction: column; max-width: 80%; }
.file-name { font-weight: 700; color: var(--text); margin-bottom: 2px; }
.file-path { color: var(--text-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.btn-icon { background: none; border: none; cursor: pointer; font-size: 1.1rem; filter: grayscale(1); }
.btn-icon:hover { filter: grayscale(0); }
</style>
