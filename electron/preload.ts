import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  startScan: (path: string) => ipcRenderer.invoke('start-scan', path),
  getStats: () => ipcRenderer.invoke('get-stats'),
  getLargeFiles: () => ipcRenderer.invoke('get-large-files'),
  getEmptyFiles: () => ipcRenderer.invoke('get-empty-files'),
  getDuplicates: () => ipcRenderer.invoke('get-duplicates'),
  quarantineFile: (id: number) => ipcRenderer.invoke('quarantine-file', id),
  getCategoryStats: () => ipcRenderer.invoke('get-category-stats'),
  getCatalog: () => ipcRenderer.invoke('get-catalog'),
  updateCatalog: (catalog: any) => ipcRenderer.invoke('update-catalog', catalog),
  getOrganizationPreview: () => ipcRenderer.invoke('get-organization-preview'),
  organizeByCategory: (selectedPaths?: string[]) => ipcRenderer.invoke('organize-by-category', selectedPaths),
  openPath: (path: string) => ipcRenderer.invoke('open-path', path),
  showItemInFolder: (path: string) => ipcRenderer.invoke('show-item-in-folder', path),
  moveItem: (source: string, targetDir: string) => ipcRenderer.invoke('move-item', source, targetDir),
  trashItem: (path: string) => ipcRenderer.invoke('trash-item', path),
  deletePermanently: (path: string) => ipcRenderer.invoke('delete-permanently', path),
  getFolderContents: (path: string) => ipcRenderer.invoke('get-folder-contents', path),
  getRootPath: () => ipcRenderer.invoke('get-root-path'),
  onScanProgress: (callback: any) => ipcRenderer.on('scan-progress', callback),
  onOrganizeProgress: (callback: any) => ipcRenderer.on('organize-progress', callback),
  onCatalogUpdated: (callback: any) => ipcRenderer.on('catalog-updated', callback),
  
  // Updates
  checkUpdates: () => ipcRenderer.invoke('check-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  onUpdaterMessage: (callback: any) => ipcRenderer.on('updater-message', callback),
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});
