<template>
  <div class="updates-view">
    <header class="section-header">
      <h2>Actualizaciones del Sistema</h2>
      <p class="subtitle">Mantén Optimizer actualizado con las últimas mejoras y parches de seguridad.</p>
    </header>

    <div class="update-card glass-panel">
      <div class="app-info">
        <div class="app-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div class="app-details">
          <h3>Organizer</h3>
          <p>Versión instalada: <strong>{{ currentVersion }}</strong></p>
        </div>
      </div>

      <div class="update-status" :class="statusData.type">
        <div class="status-icon">
          <svg v-if="statusData.type === 'checking'" width="24" height="24" viewBox="0 0 24 24" fill="none" class="spin" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          <svg v-if="statusData.type === 'available'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <svg v-if="statusData.type === 'not-available'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <svg v-if="statusData.type === 'error'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          <svg v-if="['progress', 'downloaded'].includes(statusData.type)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span v-if="!statusData.type">✨</span>
        </div>
        <div class="status-message">
          <h4>{{ statusData.text || 'Listo para buscar actualizaciones' }}</h4>
          <p v-if="statusData.error" class="error-text">{{ statusData.error }}</p>
          <p v-if="statusData.info">Versión: {{ statusData.info?.version }}</p>
          
          <div v-if="statusData.type === 'progress' && statusData.progress" class="progress-bar-container">
            <div class="progress-bar-fill" :style="{ width: (statusData.progress?.percent || 0) + '%' }"></div>
            <span class="progress-text">{{ formatBytes(statusData.progress?.transferred || 0) }} / {{ formatBytes(statusData.progress?.total || 0) }} ({{ Math.round(statusData.progress?.percent || 0) }}%)</span>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button v-if="!isProcessing && statusData.type !== 'available' && statusData.type !== 'downloaded'" @click="checkForUpdates" class="btn btn-primary">
          Buscar Actualizaciones
        </button>
        
        <button v-if="statusData.type === 'available'" @click="downloadUpdate" class="btn btn-warning pulse-glow" :disabled="isProcessing">
          Descargar Actualización
        </button>

        <button v-if="statusData.type === 'downloaded'" @click="installUpdate" class="btn btn-success pulse-glow" :disabled="isProcessing">
          Reiniciar e Instalar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentVersion = ref('Cargando...');
const statusData = ref({ type: '', text: '', error: '', info: null, progress: null });
const isProcessing = ref(false);

const checkForUpdates = async () => {
  statusData.value = { type: 'checking', text: 'Buscando actualizaciones...' };
  isProcessing.value = true;
  try {
    // @ts-ignore
    await window.electronAPI.checkUpdates();
  } catch (err) {
    statusData.value = { type: 'error', text: 'Error al buscar', error: err.message };
    isProcessing.value = false;
  }
};

const downloadUpdate = async () => {
  statusData.value = { type: 'progress', text: 'Iniciando descarga...' };
  isProcessing.value = true;
  try {
    // @ts-ignore
    await window.electronAPI.downloadUpdate();
  } catch (err) {
    statusData.value = { type: 'error', text: 'Error al descargar', error: err.message };
    isProcessing.value = false;
  }
};

const installUpdate = () => {
  isProcessing.value = true;
  // @ts-ignore
  window.electronAPI.installUpdate();
};

onMounted(async () => {
  // @ts-ignore
  if (window.electronAPI && window.electronAPI.getAppVersion) {
    // @ts-ignore
    currentVersion.value = await window.electronAPI.getAppVersion();
  }

  // @ts-ignore
  if (window.electronAPI && window.electronAPI.onUpdaterMessage) {
    // @ts-ignore
    window.electronAPI.onUpdaterMessage((event, data) => {
      statusData.value = { ...statusData.value, ...data };
      if (['not-available', 'error', 'downloaded'].includes(data.type)) {
        isProcessing.value = false;
      }
      if (data.type === 'available') {
        isProcessing.value = false; // Permite dar click a descargar
      }
    });
  }
});

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
.updates-view { padding-bottom: 2rem; }
.section-header h2 { margin-bottom: 0.2rem; }
.subtitle { color: var(--text-dim); margin-bottom: 2rem; }

.glass-panel {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 650px;
  margin: 0 auto;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

.app-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
  color: var(--accent);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.app-details h3 { font-size: 1.8rem; margin: 0 0 0.5rem 0; font-weight: 700; color: #f1f5f9; }
.app-details p { margin: 0; color: var(--text-dim); font-size: 1.1rem; }
.app-details strong { color: var(--accent); }

.update-status {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  margin-bottom: 2rem;
  border-left: 5px solid #475569;
}

.update-status.not-available { border-left-color: #10b981; }
.update-status.available { border-left-color: #f59e0b; }
.update-status.progress { border-left-color: #38bdf8; }
.update-status.downloaded { border-left-color: #38bdf8; background: rgba(56, 189, 248, 0.05); }
.update-status.error { border-left-color: #ef4444; background: rgba(239, 68, 68, 0.1); }

.status-icon { margin-top: 0.2rem; }
.status-message h4 { margin: 0 0 0.25rem 0; font-size: 1.1rem; }
.status-message p { margin: 0; color: var(--text-dim); font-size: 0.9rem; }
.error-text { color: #fca5a5 !important; margin-top: 0.5rem !important; }

.spin { animation: spin 1.5s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.progress-bar-container {
  margin-top: 1rem;
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.5rem;
  display: block;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-primary { background: #334155; color: white; }
.btn-primary:hover:not(:disabled) { background: #475569; transform: translateY(-2px); }

.btn-warning { background: #f59e0b; color: #fff; }
.btn-warning:hover:not(:disabled) { background: #d97706; transform: translateY(-2px); }

.btn-success { background: #10b981; color: #fff; }
.btn-success:hover:not(:disabled) { background: #059669; transform: translateY(-2px); }

.pulse-glow {
  box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6);
  animation: pulse 2s infinite cubic-bezier(0.66, 0, 0, 1);
}

.btn-success.pulse-glow {
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
}

@keyframes pulse {
  to { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
}
</style>
