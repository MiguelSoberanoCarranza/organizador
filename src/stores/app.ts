import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    stats: { 
      totalFiles: 0, 
      totalSize: 0, 
      duplicates: 0,
      largeFiles: [] as any[],
      emptyFiles: [] as any[]
    },
    isScanning: false,
    progress: { current: 0, total: 0, status: '' }
  }),
  actions: {
    async refreshStats() {
      // @ts-ignore
      const [stats, large, empty] = await Promise.all([
        window.electronAPI.getStats(),
        window.electronAPI.getLargeFiles(),
        window.electronAPI.getEmptyFiles()
      ]);
      this.stats = {
        totalFiles: stats?.totalFiles || 0,
        totalSize: stats?.totalSize || 0,
        duplicates: stats?.duplicatesCount || 0,
        largeFiles: large || [],
        emptyFiles: empty || []
      };
    },
    async startScan() {
      // @ts-ignore
      const folderPath = await window.electronAPI.selectFolder();
      if (!folderPath) return;

      this.isScanning = true;
      this.progress = { current: 0, total: 0, status: 'Iniciando escaneo...' };
      
      // @ts-ignore
      window.electronAPI.onScanProgress((event, data) => {
        this.progress = data;
        // Optionally partial refresh stats every 1000 files
        if (data.current % 1000 === 0) this.refreshStats();
      });

      // @ts-ignore
      await window.electronAPI.startScan(folderPath);
      await this.refreshStats();
      this.isScanning = false;
    }
  }
})
