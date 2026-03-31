<template>
  <div class="app-container">
    <main class="content">
      <header class="top-bar glass-header">
        <div class="header-left">
          <div class="logo">
            Organizer <span>v0.0.2 Beta</span>
            <router-link to="/updates" class="update-icon-top tooltip-container" title="Buscar Actualizaciones">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.27l-3.26-1.5"></path><line x1="21.5" y1="8" x2="16" y2="8"></line></svg>
            </router-link>
          </div>
          <div class="separator"></div>
          <h1>{{ $route.name }}</h1>
        </div>
      </header>
      
      <div class="scrollable-area">
        <router-view :key="reloadKey" />
      </div>
    </main>

    <nav class="bottom-nav glass-nav drag-region">
      <div class="nav-links no-drag">
        <router-link to="/" class="nav-item tooltip-container">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span class="tooltip">Dashboard</span>
        </router-link>
        
        <router-link to="/explorer" class="nav-item tooltip-container">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          <span class="tooltip">Explorador</span>
        </router-link>
        
        <!-- NEW SCAN BUTTON IN MENU -->
        <button v-if="!store.isScanning" @click="startNewScan" class="nav-item scan-action pulse-glow tooltip-container">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span class="tooltip">Escanear Carpeta</span>
        </button>
        
        <div v-if="store.isScanning" class="nav-item scan-action spinner-container tooltip-container">
           <div class="spinner"></div>
           <span class="tooltip">Escaneando: {{ store.progress.current }} / {{ store.progress.total }}</span>
        </div>
        
        <router-link to="/scan" class="nav-item tooltip-container">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          <span class="tooltip">Organizador</span>
        </router-link>

        <router-link to="/catalog" class="nav-item tooltip-container">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          <span class="tooltip">Catálogo</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from './stores/app'

const store = useAppStore()
const reloadKey = ref(0)

onMounted(() => {
    if (window.electronAPI && window.electronAPI.onCatalogUpdated) {
        window.electronAPI.onCatalogUpdated(() => {
            reloadKey.value++;
            // Optionally refresh store stats if needed globally
            store.refreshStats();
        });
    }
})

const startNewScan = async () => {
    await store.startScan()
    reloadKey.value++
}
</script>

<style>
:root {
  --bg-dark: #0f172a;
  --bg-card: #1e293b;
  --accent: #38bdf8;
  --text: #f1f5f9;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: var(--bg-dark);
  color: var(--text);
  overflow: hidden; /* Prevent body scroll, handle inside components */
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.glass-header {
  background: var(--bg-dark); /* Solid #0f172a to match Windows controls */
  z-index: 10;
}

.top-bar { 
  padding: 1rem 1.5rem;
  padding-right: 150px; /* Safe space margin for Windows native controls */
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.separator {
  height: 20px;
  width: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.top-bar h1 {
  -webkit-app-region: no-drag;
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text);
  opacity: 0.9;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--accent);
  -webkit-app-region: no-drag;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo span { 
  font-size: 0.8rem; 
  color: #64748b; 
  font-weight: 600;
}

.update-icon-top {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 0.3rem;
  margin-left: 0.3rem;
  text-decoration: none;
  transition: all 0.2s ease;
  -webkit-app-region: no-drag;
}

.update-icon-top:hover {
  color: var(--text);
  background: rgba(56, 189, 248, 0.15);
  transform: translateY(-2px);
}

.update-icon-top.router-link-active {
  color: var(--accent);
  background: rgba(56, 189, 248, 0.2);
}

.scrollable-area {
  flex: 1;
  overflow-y: auto;
  padding: 2.5rem;
  padding-bottom: 7rem; /* Space for the bottom nav */
}

/* Floating Bottom Nav */
.bottom-nav {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.6rem;
  border-radius: 24px;
  z-index: 100;
}

.glass-nav {
  background: rgba(30, 41, 59, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(56, 189, 248, 0.15);
}

.drag-region {
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 18px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.nav-item svg {
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  transform: translateY(-3px);
}

.router-link-active {
  background: rgba(56, 189, 248, 0.1);
  color: var(--accent);
  border: 1px solid rgba(56, 189, 248, 0.2);
  /* Se quitó el gradiente completo y resplandor agresivo de sombra */
}

.router-link-active svg {
  transform: scale(1.1);
}

/* Tooltip on Hover */
.tooltip-container .tooltip {
  position: absolute;
  top: -45px;
  left: 50%;
  transform: translateX(-50%) translateY(10px) scale(0.8);
  background: rgba(15, 23, 42, 0.9);
  color: var(--text);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}

.tooltip-container:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0) scale(1);
}

/* Scrollbar Customization for scrollable area */
.scrollable-area::-webkit-scrollbar {
  width: 8px;
}
.scrollable-area::-webkit-scrollbar-track {
  background: transparent;
}
.scrollable-area::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
}
.scrollable-area::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.2);
}

/* Scan action in nav */
.scan-action {
  background: linear-gradient(135deg, var(--accent) 0%, #2563eb 100%);
  color: white !important;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
}

.scan-action:hover {
  transform: translateY(-5px) scale(1.05) !important;
  background: linear-gradient(135deg, #7dd3fc 0%, #3b82f6 100%);
}

.pulse-glow {
  box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.6);
  animation: pulse 2s infinite cubic-bezier(0.66, 0, 0, 1);
}

@keyframes pulse {
  to { box-shadow: 0 0 0 15px rgba(56, 189, 248, 0); }
}

.spinner-container {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid var(--accent);
  cursor: default;
}
.spinner-container:hover { transform: none !important; }

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { 
  from { transform: rotate(0deg); } 
  to { transform: rotate(360deg); } 
}
</style>
