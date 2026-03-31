import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Organizer from '../views/Organizer.vue'
import FileExplorer from '../views/FileExplorer.vue'
import Catalog from '../views/Catalog.vue'
import Updates from '../views/Updates.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/scan',
      name: 'Organizador',
      component: Organizer
    },
    {
      path: '/explorer',
      name: 'Explorador',
      component: FileExplorer
    },
    {
      path: '/catalog',
      name: 'Catálogo',
      component: Catalog
    },
    {
      path: '/updates',
      name: 'Actualizaciones',
      component: Updates
    }
  ]
})

export default router
