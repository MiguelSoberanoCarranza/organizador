<template>
  <div class="catalog-view fade-in">
    <div class="header-actions">
      <h2>Catálogo de Archivos</h2>
      <button class="btn btn-primary" @click="saveCatalog" :disabled="isSaving">
        {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </div>

    <p class="subtitle">Configura qué extensiones pertenecen a cada categoría de organización.</p>

    <div class="categories-grid" v-if="catalog">
      <div class="category-card" v-for="(extensions, category) in catalog" :key="category">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
          <h3>{{ category }}</h3>
          <button class="remove-cat-btn" @click="removeCategory(category as string)" title="Eliminar categoría">✕</button>
        </div>
        <div class="card-body">
          <div class="extensions-list">
            <span class="extension-tag" v-for="(ext, index) in extensions" :key="index">
              {{ ext }}
              <button class="remove-btn" @click="removeExtension(category as string, index)">×</button>
            </span>
          </div>
          <div class="add-extension">
            <input 
              type="text" 
              placeholder=".ext" 
              v-model="newExtensions[category as string]" 
              @keyup.enter="addExtension(category as string)"
              class="ext-input"
            />
            <button class="btn-icon" @click="addExtension(category as string)">+</button>
          </div>
        </div>
      </div>

      <!-- Add New Category Card -->
      <div class="category-card new-category-card">
        <div class="card-header">
          <h3>Nueva Categoría</h3>
        </div>
        <div class="card-body add-category-body">
          <input 
            type="text" 
            placeholder="Ej. Modelos 3D" 
            v-model="newCategoryName" 
            @keyup.enter="addCategory"
            class="ext-input w-full"
          />
          <button class="btn btn-primary w-full mt-1" @click="addCategory">
            Agregar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue';

const catalog = ref<Record<string, string[]>>({});
const newExtensions = ref<Record<string, string>>({});
const isSaving = ref(false);
const newCategoryName = ref('');

onMounted(async () => {
  if ((window as any).electronAPI) {
    catalog.value = await (window as any).electronAPI.getCatalog();
  }
});

const removeExtension = (category: string, index: number) => {
  catalog.value[category].splice(index, 1);
};

const addExtension = (category: string) => {
  let ext = newExtensions.value[category]?.trim();
  if (ext) {
    if (!ext.startsWith('.')) {
      ext = '.' + ext;
    }
    ext = ext.toLowerCase();
    
    if (!catalog.value[category].includes(ext)) {
      catalog.value[category].push(ext);
    }
    newExtensions.value[category] = '';
  }
};

const addCategory = () => {
  const name = newCategoryName.value.trim();
  if (name && !catalog.value[name] && name.toLowerCase() !== 'otros') {
    catalog.value = { ...catalog.value, [name]: [] };
    newCategoryName.value = '';
  } else if (name) {
    alert("Categoría inválida o ya existe.");
  }
};

const removeCategory = (category: string) => {
  if (confirm(`¿Estás seguro de eliminar la categoría "${category}"?`)) {
    const newCatalog = { ...catalog.value };
    delete newCatalog[category];
    catalog.value = newCatalog;
  }
};

const saveCatalog = async () => {
  isSaving.value = true;
  if ((window as any).electronAPI) {
    const rawCatalog = JSON.parse(JSON.stringify(toRaw(catalog.value)));
    await (window as any).electronAPI.updateCatalog(rawCatalog);
  }
  setTimeout(() => {
    isSaving.value = false;
  }, 500);
};
</script>

<style scoped>
.catalog-view {
  padding: 1rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

h2 {
  margin: 0;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #94a3b8;
  margin-bottom: 2rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 15px -5px rgba(0, 0, 0, 0.3);
}

.card-header {
  background: rgba(255, 255, 255, 0.02);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #f1f5f9;
}

.card-body {
  padding: 1.5rem;
}

.extensions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.extension-tag {
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.remove-btn:hover {
  opacity: 1;
}

.add-extension {
  display: flex;
  gap: 0.5rem;
}

.ext-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
  color: white;
  font-size: 0.9rem;
}

.ext-input:focus {
  outline: none;
  border-color: #38bdf8;
}

.btn-icon {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #38bdf8;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #38bdf8;
  color: #0f172a;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #38bdf8, #2563eb);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
.remove-cat-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1.1rem;
  transition: color 0.2s;
}
.remove-cat-btn:hover {
  color: #ef4444;
}
.new-category-card {
  border: 1px dashed rgba(56, 189, 248, 0.4);
  background: rgba(30, 41, 59, 0.4);
}
.w-full { width: 100%; box-sizing: border-box; }
.mt-1 { margin-top: 1rem; }
</style>
