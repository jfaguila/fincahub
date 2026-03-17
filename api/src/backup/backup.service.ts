import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execFileAsync = promisify(execFile);

@Injectable()
export class BackupService {
    private readonly logger = new Logger(BackupService.name);
    private readonly backupDir = process.env.BACKUP_DIR || '/tmp/fincahub-backups';

    // Run every day at 3:00 AM UTC
    @Cron('0 3 * * *')
    async runDailyBackup() {
        await this.createBackup();
    }

    async createBackup(): Promise<string | null> {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            this.logger.warn('[Backup] DATABASE_URL no configurada, backup omitido.');
            return null;
        }

        // Ensure backup directory exists
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }

        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const fileName = `fincahub-${timestamp}.sql.gz`;
        const filePath = path.join(this.backupDir, fileName);

        try {
            // Use pg_dump + gzip
            await execFileAsync('sh', [
                '-c',
                `pg_dump "${databaseUrl}" | gzip > "${filePath}"`,
            ]);

            const stats = fs.statSync(filePath);
            const sizeMb = (stats.size / 1024 / 1024).toFixed(2);
            this.logger.log(`[Backup] OK → ${fileName} (${sizeMb} MB)`);

            // Clean up backups older than 7 days
            this.cleanOldBackups();

            return filePath;
        } catch (err: any) {
            this.logger.error(`[Backup] Error ejecutando pg_dump: ${err.message}`);
            // Clean up failed file
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return null;
        }
    }

    private cleanOldBackups() {
        try {
            const files = fs.readdirSync(this.backupDir);
            const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

            for (const file of files) {
                if (!file.startsWith('fincahub-') || !file.endsWith('.sql.gz')) continue;
                const filePath = path.join(this.backupDir, file);
                const stat = fs.statSync(filePath);
                if (stat.mtimeMs < sevenDaysAgo) {
                    fs.unlinkSync(filePath);
                    this.logger.log(`[Backup] Borrado backup antiguo: ${file}`);
                }
            }
        } catch {
            // non-critical
        }
    }

    listBackups(): Array<{ name: string; size: string; date: string }> {
        try {
            if (!fs.existsSync(this.backupDir)) return [];
            return fs.readdirSync(this.backupDir)
                .filter(f => f.startsWith('fincahub-') && f.endsWith('.sql.gz'))
                .map(f => {
                    const stat = fs.statSync(path.join(this.backupDir, f));
                    return {
                        name: f,
                        size: `${(stat.size / 1024 / 1024).toFixed(2)} MB`,
                        date: stat.mtime.toISOString(),
                    };
                })
                .sort((a, b) => b.date.localeCompare(a.date));
        } catch {
            return [];
        }
    }
}
