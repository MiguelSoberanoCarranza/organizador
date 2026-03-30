<template>
  <div class="dashboard">
    <div class="header-section">
      <h1 class="page-title">Bienvenido a <span class="gradient-text">Organizer</span></h1>
      <p class="subtitle">Resumen general de tu sistema de archivos</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card glass-panel">
        <div class="icon-wrapper blue">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
        </div>
        <div class="stat-info">
          <h3>Total Archivos</h3>
          <p class="value">{{ store.stats.totalFiles.toLocaleString() }}</p>
        </div>
      </div>
      
      <div class="stat-card glass-panel">
        <div class="icon-wrapper purple">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
        </div>
        <div class="stat-info">
          <h3>Espacio Total</h3>
          <p class="value">{{ formatSize(store.stats.totalSize) }}</p>
        </div>
      </div>
    </div>

    <div class="results-grid">
      <!-- Archivos Grandes -->
      <section class="result-section glass-panel">
        <div class="section-header">
          <div class="header-icon orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c-2.28 0-3-1.87-3-3m5.5 5.5A2.5 2.5 0 0 0 11 12c2.28 0 3-1.87 3-3m-6 3a2.5 2.5 0 0 1 5 0M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8l-6 6v12a2 2 0 0 0 2 2z"></path></svg>
          </div>
          <h2>Archivos más grandes</h2>
        </div>
        <div class="list">
          <div v-for="file in store.stats.largeFiles" :key="file.id" class="list-item">
            <div class="file-info">
              <span class="name" :title="file.name">{{ file.name }}</span>
            </div>
            <span class="meta badge-orange">{{ formatSize(file.size) }}</span>
          </div>
          <div v-if="!store.stats.largeFiles.length" class="empty-state">
            No hay datos para mostrar
          </div>
        </div>
      </section>

      <!-- Archivos Vacíos -->
      <section class="result-section glass-panel">
        <div class="section-header">
          <div class="header-icon red">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </div>
          <h2>Archivos Vacíos (Basura)</h2>
        </div>
        <div class="list">
          <div v-for="file in store.stats.emptyFiles" :key="file.id" class="list-item">
            <div class="file-info">
              <span class="name" :title="file.name">{{ file.name }}</span>
            </div>
            <span class="meta badge-red">0 B</span>
          </div>
          <div v-if="!store.stats.emptyFiles.length" class="empty-state">
            No hay datos para mostrar
          </div>
        </div>
      </section>
    </div>
    
    <!-- Escanear button removido, ahora está a nivel global en App.vue -->
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/app'
import { onMounted } from 'vue'

const store = useAppStore()

onMounted(() => {
  store.refreshStats()
})

const formatSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.5s ease-out;
  padding-bottom: 6rem;
}

.header-section {
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent) 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-dim);
  font-size: 1.05rem;
}

.glass-panel {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper.blue {
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
}

.icon-wrapper.purple {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.stat-info h3 { 
  color: var(--text-dim); 
  font-size: 0.85rem; 
  text-transform: uppercase; 
  letter-spacing: 0.05em; 
  margin-bottom: 0.2rem;
}

.value { 
  font-size: 2.2rem; 
  font-weight: 800; 
  color: var(--text); 
}

.results-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2rem;
}

@media (max-width: 1024px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}

.result-section {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.header-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon.orange {
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.header-icon.red {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.result-section h2 { 
  font-size: 1.25rem; 
  font-weight: 600;
  margin: 0;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.list-item {
  padding: 0.8rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 10px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  min-width: 0;
}

.list-item:hover {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255,255,255,0.05);
  transform: translateX(4px);
}

.file-info {
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-right: 1rem;
  min-width: 0;
  flex: 1;
}

.name { 
  font-weight: 500; 
  font-size: 0.95rem; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}

.meta { 
  font-size: 0.8rem; 
  font-weight: 700;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  white-space: nowrap;
}

.badge-orange {
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.badge-red {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 2.5rem;
  color: var(--text-dim);
  font-style: italic;
  background: rgba(15, 23, 42, 0.2);
  border-radius: 10px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
