import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';

export class DatabaseService {
    public db: any;

    constructor() {
        const dbPath = path.join(app.getPath('userData'), 'organizer.db');
        this.db = new Database(dbPath);
        this.init();
    }

    private init() {
        this.db.prepare('CREATE TABLE IF NOT EXISTS scan_sessions (id INTEGER PRIMARY KEY, root_path TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)').run();
        
        // Robust schema update: check if column exists
        const tableInfo = this.db.prepare("PRAGMA table_info(files)").all();
        const hasParentPath = tableInfo.some((col: any) => col.name === 'parent_path');
        
        if (tableInfo.length > 0 && !hasParentPath) {
            // Old table exists without parent_path, drop it to recreate with correct schema
            this.db.exec('DROP TABLE files');
        }

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY, 
                session_id INTEGER, 
                name TEXT, 
                path TEXT UNIQUE, 
                parent_path TEXT,
                extension TEXT, 
                category TEXT, 
                size INTEGER, 
                hash TEXT, 
                modified_at DATETIME
            )
        `).run();

        this.db.prepare('CREATE TABLE IF NOT EXISTS history_actions (id INTEGER PRIMARY KEY, action_type TEXT, source_path TEXT, target_path TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)').run();
        this.db.prepare('CREATE INDEX IF NOT EXISTS idx_files_hash ON files(hash)').run();
        this.db.prepare('CREATE INDEX IF NOT EXISTS idx_files_size ON files(size)').run();
        this.db.prepare('CREATE INDEX IF NOT EXISTS idx_files_parent ON files(parent_path)').run();
        
        this.db.exec('DELETE FROM files');
    }

    getStats() {
        const stats = this.db.prepare("SELECT COUNT(*) as count, SUM(size) as total FROM files WHERE extension != 'folder'").get();
        const totalFiles = stats.count || 0;
        const totalSize = stats.total || 0;
        
        // Accurate duplicates count based on real hashes
        const dupResult = this.db.prepare('SELECT COUNT(DISTINCT hash) as count FROM files WHERE hash IS NOT NULL GROUP BY hash HAVING COUNT(*) > 1').all();
        const duplicatesCount = dupResult.length;
        
        return { totalFiles, totalSize, duplicatesCount };
    }

    getLargeFiles() {
        return this.db.prepare("SELECT * FROM files WHERE extension != 'folder' ORDER BY size DESC LIMIT 10").all();
    }

    getEmptyFiles() {
        return this.db.prepare("SELECT * FROM files WHERE size = 0 AND extension != 'folder'").all();
    }

    insertFiles(files: any[], sessionId: number) {
        const insert = this.db.prepare('INSERT OR REPLACE INTO files (session_id, name, path, parent_path, extension, category, size, modified_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        const transaction = this.db.transaction((items: any[]) => {
            for (const item of items) insert.run(sessionId, item.name, item.path, item.parent, item.extension, item.category, item.size, item.mtime);
        });
        transaction(files);
    }

    createSession(rootPath: string) {
        this.db.exec('DELETE FROM files');
        return this.db.prepare('INSERT INTO scan_sessions (root_path) VALUES (?)').run(rootPath).lastInsertRowid;
    }

    getCategoryStats() {
        const stats = this.db.prepare('SELECT category, COUNT(*) as count FROM files GROUP BY category').all();
        const result: Record<string, number> = {};
        stats.forEach((s: any) => result[s.category] = s.count);
        return result;
    }

    getAllFilesToOrganize() {
        return this.db.prepare('SELECT id, name, path, category FROM files').all();
    }
}
