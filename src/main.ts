import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './index.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

declare global {
  interface Window {
    electronAPI: {
      selectFolder: () => Promise<string>;
      startScan: (path: string) => Promise<any>;
      getStats: () => Promise<any>;
      getLargeFiles: () => Promise<any[]>;
      getEmptyFiles: () => Promise<any[]>;
      getDuplicates: () => Promise<any[]>;
      onScanProgress: (callback: any) => void;
    }
  }
}
