import fs from 'fs/promises';
import { createReadStream } from 'fs';
import crypto from 'crypto';
import path from 'path';
import { DatabaseService } from '../db/database';

export class DuplicateService {
    constructor(private db: DatabaseService) {}

    private async calculateHash(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            const stream = createReadStream(filePath);
            stream.on('data', (data) => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', (err) => reject(err));
        });
    }

    private async calculatePartialHash(filePath: string, bytesToRead = 8192): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            const stream = createReadStream(filePath, { start: 0, end: bytesToRead - 1 });
            stream.on('data', (data) => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', (err) => reject(err));
        });
    }

    async findDuplicates(event?: any) {
        // Encontrar candidatos por mismo tamaño exacto
        const candidates = this.db.db.prepare(`
            SELECT size, COUNT(*) as count 
            FROM files 
            WHERE size > 0 
            GROUP BY size 
            HAVING count > 1
        `).all();

        let totalProcessed = 0;
        const totalCandidates = candidates.reduce((acc: number, c: any) => acc + c.count, 0);

        for (const candidate of candidates as any[]) {
            const files = this.db.db.prepare('SELECT id, path, size FROM files WHERE size = ?').all(candidate.size);
            
            // FASE 1: Hash Rápido (primeros 8KB)
            const quickHashes = new Map<string, any[]>();
            
            for (const file of files as any[]) {
                try {
                    const limit = Math.min(8192, file.size);
                    const qh = await this.calculatePartialHash(file.path, limit);
                    if (!quickHashes.has(qh)) quickHashes.set(qh, []);
                    quickHashes.get(qh)!.push(file);
                } catch(e) { /* ignorar errores de lectura */ }
            }

            // FASE 2: Hash Completo solo a los comprobados
            for (const group of Array.from(quickHashes.values())) {
                if (group.length > 1) {
                    for (const file of group) {
                        totalProcessed++;
                        if (event && totalProcessed % 10 === 0) {
                            event.sender.send('scan-progress', { 
                                current: totalProcessed, 
                                total: totalCandidates, 
                                status: `Verificando detalles: ${path.basename(file.path)}` 
                            });
                        }
                        try {
                            const hash = await this.calculateHash(file.path);
                            this.db.db.prepare('UPDATE files SET hash = ? WHERE id = ?').run(hash, file.id);
                        } catch(e) {}
                    }
                } else {
                    // Si este no tiene duplicado, sumar al progreso igual
                    totalProcessed += group.length;
                }
            }
        }
    }

    async getDuplicateGroups() {
        const groups = this.db.db.prepare(`
            SELECT hash, COUNT(*) as count, SUM(size) as totalSize 
            FROM files 
            WHERE hash IS NOT NULL 
            GROUP BY hash 
            HAVING count > 1
        `).all();

        return (groups as any[]).map(group => ({
            ...group,
            files: this.db.db.prepare('SELECT id, name, path, size FROM files WHERE hash = ?').all(group.hash)
        }));
    }
}
