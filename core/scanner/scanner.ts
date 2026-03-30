import fs from 'fs/promises';
import path from 'path';
import { DatabaseService } from '../db/database';
import { catalogService } from '../config/catalog';

export class ScannerService {
    constructor(private db: DatabaseService) {}

    async scan(rootPath: string, event?: any) {
        const sessionId = this.db.createSession(rootPath);
        let files: any[] = [];
        let count = 0;

        // Limpia memoria subiendo a la base de datos frecuentemente
        const flush = () => {
            if (files.length > 0) {
                this.db.insertFiles(files, sessionId as number);
                files = [];
            }
        };

        const walk = async (dir: string): Promise<number> => {
            const lowDir = dir.toLowerCase();
            const systemPaths = ['$recycle.bin', 'system volume information', 'windows', '.gamingroot', 'archivos de programa', 'documents and settings'];
            if (systemPaths.some(sp => lowDir.includes(sp))) return 0;

            let dirSize = 0;
            try {
                const entries = await fs.readdir(dir, { withFileTypes: true });
                
                // Dividir carpetas y archivos para procesarlos en lote
                const directories = entries.filter(e => e.isDirectory() && !e.name.startsWith('.') && !e.name.startsWith('$'));
                const filesInDir = entries.filter(e => e.isFile() && !e.name.startsWith('.') && !e.name.startsWith('$'));

                // 1. STATS concurrentes: Pregunta al OS por todos a la vez, quitando bloqueos secuenciales
                const statsPromises = filesInDir.map(async (entry) => {
                    const fullPath = path.join(dir, entry.name);
                    try {
                        const stats = await fs.stat(fullPath);
                        return { entry, fullPath, stats };
                    } catch (e) {
                        return null;
                    }
                });

                const statsResults = await Promise.all(statsPromises);

                for (const result of statsResults) {
                    if (!result) continue;
                    const { entry, fullPath, stats } = result;

                    count++;
                    dirSize += stats.size;
                    
                    const ext = path.extname(entry.name).toLowerCase();
                    let category = catalogService.getCategoryForExtension(ext);

                    files.push({
                        name: entry.name,
                        path: fullPath,
                        parent: dir,
                        extension: ext,
                        category: category,
                        size: stats.size,
                        mtime: stats.mtime.toISOString()
                    });

                    // Si pasamos los 1000 archivos, salvar en DB (Ahorra toda la RAM)
                    if (files.length >= 1000) flush();
                }

                if (event && count % 50 === 0 && files.length > 0) {
                    event.sender.send('scan-progress', { current: count, total: 0, status: `Escaneando: ${path.basename(dir)}` });
                }

                // 2. Procesar recursivo a las carpetas
                for (const dirEntry of directories) {
                    const fullPath = path.join(dir, dirEntry.name);
                    const subfolderSize = await walk(fullPath);
                    dirSize += subfolderSize;
                    
                    files.push({
                        name: dirEntry.name,
                        path: fullPath,
                        parent: path.normalize(dir),
                        extension: 'folder',
                        category: 'Carpeta',
                        size: subfolderSize,
                        mtime: new Date().toISOString()
                    });

                    if (files.length >= 1000) flush();
                }

            } catch (e) {}
            return dirSize;
        }

        await walk(rootPath);
        flush(); // Guardar el remanente en DB
        return { totalFiles: count };
    }
}
