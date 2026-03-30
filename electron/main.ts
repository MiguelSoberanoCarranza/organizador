import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import { DatabaseService } from '../core/db/database';
import { ScannerService } from '../core/scanner/scanner';
import { DuplicateService } from '../core/duplicates/duplicates';
import fs from 'fs/promises';
import { catalogService } from '../core/config/catalog';


let mainWindow: BrowserWindow | null = null;
const db = new DatabaseService();
const scanner = new ScannerService(db);

function isSafePath(targetPath: string): boolean {
    try {
        const row = db.db.prepare('SELECT root_path FROM scan_sessions ORDER BY id DESC LIMIT 1').get();
        if (!row || !row.root_path) return false;
        
        const rootPath = row.root_path;
        const normalizedTarget = path.normalize(targetPath).toLowerCase();
        const normalizedRoot = path.normalize(rootPath).toLowerCase();

        // 1. Debe estar estrictamente dentro de la ruta raíz actual escaneada
        if (!normalizedTarget.startsWith(normalizedRoot)) return false;

        // 2. Protecciones estrictas del sistema por si escanearon C:\
        const systemDirs = [
            'windows', 
            'program files', 
            'program files (x86)', 
            'programdata',
            'system volume information',
            '$recycle.bin'
        ];
        
        for (const sysDir of systemDirs) {
            // Check if normalized path contains the system path separated by slashes
            if (normalizedTarget.includes(`\\${sysDir}\\`) || normalizedTarget.endsWith(`\\${sysDir}`)) {
                return false;
            }
        }
        return true;
    } catch(e) {
        return false;
    }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
        color: '#0f172a',
        symbolColor: '#ffffff',
        height: 44
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

// IPC Handlers
ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
        properties: ['openDirectory']
    });
    return result.filePaths[0];
});

ipcMain.handle('start-scan', async (event, folderPath) => {
    const scanResult = await scanner.scan(folderPath, event);
    // await new DuplicateService(db).findDuplicates(event);
    return scanResult;
});

ipcMain.handle('show-item-in-folder', async (event, fullPath) => {
    shell.showItemInFolder(fullPath);
});

ipcMain.handle('move-item', async (event, sourcePath, targetDir) => {
    if (!isSafePath(sourcePath)) return { success: false, error: 'Ruta protegida por seguridad.' };
    
    try {
        const fileName = path.basename(sourcePath);
        const targetPath = path.join(targetDir, fileName);
        await fs.rename(sourcePath, targetPath);
        db.db.prepare('DELETE FROM files WHERE path = ? OR path LIKE ?').run(sourcePath, sourcePath + '\\%');
        return { success: true };
    } catch (e: any) {
        if (e.code === 'EXDEV' || e.code === 'EPERM') {
            try {
                const fileName = path.basename(sourcePath);
                const targetPath = path.join(targetDir, fileName);
                const stats = await fs.stat(sourcePath);
                if (stats.isDirectory()) {
                    await fs.cp(sourcePath, targetPath, { recursive: true });
                    await fs.rm(sourcePath, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
                } else {
                    await fs.copyFile(sourcePath, targetPath);
                    await fs.unlink(sourcePath);
                }
                db.db.prepare('DELETE FROM files WHERE path = ? OR path LIKE ?').run(sourcePath, sourcePath + '\\%');
                return { success: true };
            } catch (err: any) {
                return { success: false, error: err.message };
            }
        }
        return { success: false, error: e.message };
    }
});

ipcMain.handle('trash-item', async (event, fullPath) => {
    if (!isSafePath(fullPath)) return { success: false, error: 'Ruta protegida por seguridad.' };
    
    try {
        await shell.trashItem(fullPath);
        db.db.prepare('DELETE FROM files WHERE path = ? OR path LIKE ?').run(fullPath, fullPath + '\\%');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
});

ipcMain.handle('delete-permanently', async (event, fullPath) => {
    if (!isSafePath(fullPath)) return { success: false, error: 'Ruta protegida por seguridad.' };
    
    try {
        await fs.rm(fullPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
        db.db.prepare('DELETE FROM files WHERE path = ? OR path LIKE ?').run(fullPath, fullPath + '\\%');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
});

ipcMain.handle('open-path', async (event, fullPath) => {
    return shell.openPath(fullPath);
});

ipcMain.handle('get-folder-contents', async (event, folderPath) => {
    return db.db.prepare('SELECT * FROM files WHERE parent_path = ?').all(path.normalize(folderPath));
});

ipcMain.handle('get-root-path', async () => {
    return db.db.prepare('SELECT root_path FROM scan_sessions ORDER BY id DESC LIMIT 1').get()?.root_path;
});

ipcMain.handle('get-large-files', async () => db.getLargeFiles());
ipcMain.handle('get-empty-files', async () => db.getEmptyFiles());
ipcMain.handle('get-duplicates', async () => new DuplicateService(db).getDuplicateGroups());
ipcMain.handle('get-category-stats', async () => db.getCategoryStats());
ipcMain.handle('get-stats', async () => db.getStats());

ipcMain.handle('get-catalog', async () => catalogService.getCatalog());
ipcMain.handle('update-catalog', async (event, newCatalog) => {
    catalogService.updateCatalog(newCatalog);
    
    try {
        const extensions = db.db.prepare("SELECT DISTINCT extension FROM files WHERE extension != 'folder'").all();
        const stmt = db.db.prepare("UPDATE files SET category = ? WHERE extension = ?");
        
        db.db.transaction(() => {
            for (const row of extensions) {
                if (row.extension) {
                    const newCategory = catalogService.getCategoryForExtension(row.extension);
                    stmt.run(newCategory, row.extension);
                }
            }
        })();
    } catch (e) {
        console.error("Fallo actualizando tabla tras cambio de catálogo", e);
    }

    return { success: true };
});


ipcMain.handle('get-organization-preview', async (event) => {
    const rootPath = db.db.prepare('SELECT root_path FROM scan_sessions ORDER BY id DESC LIMIT 1').get().root_path;
    const entries = await fs.readdir(rootPath, { withFileTypes: true });
    const plan = [];

    const systemPaths = ['$recycle.bin', 'system volume information', 'windows', '.gamingroot', 'archivos de programa', 'documents and settings'];

    for (const entry of entries) {
        const nameLower = entry.name.toLowerCase();
        if (nameLower.startsWith('.') || nameLower.startsWith('$')) continue;
        if (systemPaths.includes(nameLower)) continue;
        
        const catalogKeys = Object.keys(catalogService.getCatalog());
        if ([...catalogKeys, 'Otros'].includes(entry.name)) continue;

        const fullPath = path.join(rootPath, entry.name);
        let category = 'Otros';

        if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            category = catalogService.getCategoryForExtension(ext);
        } else if (entry.isDirectory()) {
            const predominant = db.db.prepare(`
                SELECT category, COUNT(*) as count FROM files WHERE path LIKE ? GROUP BY category ORDER BY count DESC LIMIT 1
            `).get(fullPath + '%');
            if (predominant) category = predominant.category;
        }
        
        if (!catalogKeys.includes(category)) {
            category = 'Otros';
        }

        const fileData = db.db.prepare('SELECT size FROM files WHERE path = ?').get(fullPath);
        const size = fileData ? fileData.size : 0;

        const target = path.join(rootPath, category, entry.name);
        if (fullPath !== target) {
            plan.push({
                name: entry.name,
                source: fullPath,
                target: target,
                category: category,
                size: size,
                type: entry.isDirectory() ? 'Carpeta' : 'Archivo'
            });
        }
    }
    return plan;
});

ipcMain.handle('organize-by-category', async (event, customPlan: any[]) => {
    const rootPath = db.db.prepare('SELECT root_path FROM scan_sessions ORDER BY id DESC LIMIT 1').get().root_path;
    
    if (!customPlan || !Array.isArray(customPlan)) {
        return { success: false, error: "Plan inválido" };
    }
    
    const total = customPlan.length;
    let current = 0;

    const moveItem = async (src: string, dest: string, name: string) => {
        try {
            await fs.rename(src, dest);
        } catch (err: any) {
            if (err.code === 'EPERM' || err.code === 'EACCES' || err.code === 'EXDEV') {
                event.sender.send('organize-progress', { current, total, name: `Copiando archivo pesado: ${name}...` });
                const stats = await fs.stat(src);
                if (stats.isDirectory()) {
                    await fs.cp(src, dest, { recursive: true });
                    await fs.rm(src, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
                } else {
                    await fs.copyFile(src, dest);
                    await fs.unlink(src);
                }
            } else {
                throw err;
            }
        }
    };

    const errors = [];
    for (const item of customPlan) {
        current++;
        event.sender.send('organize-progress', { current, total, name: item.name });

        const fullPath = item.source;
        if (!isSafePath(fullPath)) {
            errors.push({ name: item.name, error: 'Bloqueado por seguridad', code: 'EPERM_SEC' });
            continue;
        }

        const category = item.category || 'Otros';
        const catDir = path.join(rootPath, category);
        try {
            await fs.mkdir(catDir, { recursive: true });
            const newPath = path.join(catDir, item.name);
            if (fullPath !== newPath) {
                await moveItem(fullPath, newPath, item.name);
                db.db.prepare('INSERT INTO history_actions (action_type, source_path, target_path) VALUES (?, ?, ?)')
                     .run('organize', fullPath, newPath);
            }
        } catch (e: any) { 
            console.error(`Error procesando ${item.name}:`, e.message);
            errors.push({ name: item.name, error: e.message, code: e.code });
        }
    }
    return { success: true, errorCount: errors.length, errors };
});

ipcMain.handle('quarantine-file', async (event, id) => {
    // Move to a local .quarantine folder
    const file = db.db.prepare('SELECT * FROM files WHERE id = ?').get(id);
    const quarantinePath = path.join(app.getPath('userData'), 'Quarantine');
    
    try {
        await fs.mkdir(quarantinePath, { recursive: true });
        const newPath = path.join(quarantinePath, file.name);
        await fs.rename(file.path, newPath);
        
        db.db.prepare('INSERT INTO history_actions (action_type, source_path, target_path) VALUES (?, ?, ?)')
             .run('quarantine', file.path, newPath);
             
        db.db.prepare('DELETE FROM files WHERE id = ?').run(id);
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: e };
    }
});
