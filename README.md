#  Organizer v0.0.2 Beta

**Organizer** es una aplicación de escritorio potente y minimalista para Windows diseñada para analizar, organizar y limpiar tus archivos de manera inteligente. Construida con tecnologías modernas para ofrecer un rendimiento excepcional y una interfaz de usuario premium.

![Dashboard Preview](https://via.placeholder.com/800x450?text=Organizer+UI+Preview)

##  Características Principales

*   ** Escaneo Inteligente**: Analiza directorios completos rápidamente detectando categorías de archivos.
*   ** Organización Automática**: Clasifica tus archivos en carpetas (Imágenes, Documentos, Música, etc.) basándose en un catálogo inteligente personalizable.
*   ** Estadísticas de Almacenamiento**: Visualiza cuánto espacio ocupan tus categorías y detecta archivos pesados o duplicados.
*   ** Actualizaciones Integradas**: Sistema de auto-update integrado con GitHub para mantenerte siempre en la última versión.
*   ** Interfaz Premium**: Diseño oscuro moderno con efectos de desenfoque (Glassmorphism) y animaciones fluidas.

##  Stack Tecnológico

*   **Core**: [Electron](https://www.electronjs.org/) (Desktop framework)
*   **Frontend**: [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
*   **Base de Datos**: [SQLite](https://www.sqlite.org/) (vía better-sqlite3)
*   **Estilos**: Vanilla CSS con variables modernas.
*   **Actualizaciones**: [electron-updater](https://www.electron.build/auto-update)

##  Instalación y Desarrollo

### Requisitos
*   [Node.js](https://nodejs.org/) (v18 o superior)
*   npm

### Configuración
1. Clona el repositorio:
   ```bash
   git clone https://github.com/MiguelSoberanoCarranza/organizador.git
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

### Ejecución en Desarrollo
```bash
npm run dev
```

### Generar Instalador (.exe)
```bash
npm run build
```

## 📝 Notas de Versión

Actualmente la aplicación se encuentra en fase **Beta (v0.0.2)**. Estamos trabajando continuamente para mejorar la detección de archivos y la velocidad de organización.

---
Desarrollado con ❤️ por [Miguel Soberano Carranza](https://github.com/MiguelSoberanoCarranza)
