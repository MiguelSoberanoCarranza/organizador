import fs from 'fs';
import path from 'path';
import { app } from 'electron';

const DEFAULT_CATALOG: Record<string, string[]> = {
    'Imágenes': ['.jpg', '.png', '.gif', '.webp'],
    'Videos': ['.mp4', '.mkv', '.mov'],
    'Documentos': ['.pdf', '.docx', '.txt', '.xlsx'],
    'Software': ['.exe', '.msi', '.bat', '.cmd'],
    'Imágenes de Disco': ['.iso', '.img', '.vmdk', '.vhd'],
    'Videojuegos': ['.pak', '.sav', '.vpk', '.forge', '.pck', '.bsa', '.scs', '.upk', '.vdf', '.wad', '.szs', '.cpk', '.rpf', '.ba2', '.assets'],
    'Comprimidos': ['.zip', '.rar', '.7z', '.tar', '.gz'],
    'Código': ['.js', '.ts', '.vue', '.dart', '.py', '.java', '.cpp', '.c', '.cs', '.html', '.css', '.php', '.sql', '.sh', '.json', '.xml', '.yaml', '.md', '.go', '.rs', '.bak']
};

export class CatalogConfig {
    private configPath: string;
    private currentCatalog: Record<string, string[]>;

    constructor() {
        this.configPath = path.join(app.getPath('userData'), 'catalog.json');
        this.currentCatalog = this.loadConfig();
    }

    private loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            }
        } catch (e) {
            console.error('Error reading catalog.json', e);
        }
        return { ...DEFAULT_CATALOG };
    }

    public getCatalog() {
        return this.currentCatalog;
    }

    public updateCatalog(newCatalog: Record<string, string[]>) {
        this.currentCatalog = newCatalog;
        fs.writeFileSync(this.configPath, JSON.stringify(this.currentCatalog, null, 2), 'utf8');
    }

    public getCategoryForExtension(ext: string): string {
        ext = ext.toLowerCase();
        for (const [category, extensions] of Object.entries(this.currentCatalog)) {
            if (extensions.includes(ext)) {
                return category;
            }
        }
        return 'Otros';
    }
}

export const catalogService = new CatalogConfig();
