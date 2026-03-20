import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class BackupService {
    private readonly logger = new Logger(BackupService.name);
    private readonly backupDir = process.env.BACKUP_DIR || '/tmp/fincahub-backups';

    private getS3Client(): S3Client | null {
        const bucket = process.env.AWS_S3_BUCKET;
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        if (!bucket || !accessKeyId || !secretAccessKey) return null;

        const config: any = {
            region: process.env.AWS_S3_REGION || 'auto',
            credentials: { accessKeyId, secretAccessKey },
        };
        // Cloudflare R2 or custom S3-compatible endpoint
        if (process.env.AWS_S3_ENDPOINT) {
            config.endpoint = process.env.AWS_S3_ENDPOINT;
        }
        return new S3Client(config);
    }

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

        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }

        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const fileName = `fincahub-${timestamp}.sql.gz`;
        const filePath = path.join(this.backupDir, fileName);

        try {
            const dbUrl = new URL(databaseUrl);
            const dbName = dbUrl.pathname.slice(1);

            await new Promise<void>((resolve, reject) => {
                const pgDump = spawn('pg_dump', [
                    '--host', dbUrl.hostname,
                    '--port', dbUrl.port || '5432',
                    '--username', dbUrl.username,
                    '--dbname', dbName,
                    '--no-password',
                ], {
                    env: { ...process.env, PGPASSWORD: decodeURIComponent(dbUrl.password) },
                });

                const gzip = spawn('gzip', [], { stdio: ['pipe', 'pipe', 'pipe'] });
                const output = fs.createWriteStream(filePath);

                pgDump.stdout.pipe(gzip.stdin);
                gzip.stdout.pipe(output);

                pgDump.stderr.on('data', (d) => this.logger.warn(`[Backup] pg_dump: ${d}`));
                gzip.stderr.on('data', (d) => this.logger.warn(`[Backup] gzip: ${d}`));

                output.on('finish', resolve);
                pgDump.on('error', reject);
                gzip.on('error', reject);
                output.on('error', reject);
            });

            const stats = fs.statSync(filePath);
            const sizeMb = (stats.size / 1024 / 1024).toFixed(2);
            this.logger.log(`[Backup] Local OK → ${fileName} (${sizeMb} MB)`);

            // Upload to S3/R2 if configured
            await this.uploadToS3(filePath, fileName);

            this.cleanOldBackups();
            return filePath;
        } catch (err: any) {
            this.logger.error(`[Backup] Error: ${err.message}`);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return null;
        }
    }

    private async uploadToS3(filePath: string, fileName: string): Promise<void> {
        const s3 = this.getS3Client();
        const bucket = process.env.AWS_S3_BUCKET;
        if (!s3 || !bucket) {
            this.logger.warn('[Backup] S3 no configurado — backup solo local. Añade AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY en Railway para activar.');
            return;
        }

        try {
            const fileStream = fs.createReadStream(filePath);
            await s3.send(new PutObjectCommand({
                Bucket: bucket,
                Key: `backups/${fileName}`,
                Body: fileStream,
                ContentType: 'application/gzip',
            }));
            this.logger.log(`[Backup] S3 OK → s3://${bucket}/backups/${fileName}`);

            // Clean S3 backups older than 30 days
            await this.cleanOldS3Backups(s3, bucket);
        } catch (err: any) {
            this.logger.error(`[Backup] Error subiendo a S3: ${err.message}`);
        }
    }

    private async cleanOldS3Backups(s3: S3Client, bucket: string): Promise<void> {
        try {
            const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
            const list = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: 'backups/fincahub-' }));
            for (const obj of list.Contents || []) {
                if (obj.LastModified && obj.LastModified.getTime() < thirtyDaysAgo && obj.Key) {
                    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: obj.Key }));
                    this.logger.log(`[Backup] S3 borrado antiguo: ${obj.Key}`);
                }
            }
        } catch {
            // non-critical
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
                    this.logger.log(`[Backup] Local borrado antiguo: ${file}`);
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

    isS3Configured(): boolean {
        return !!(process.env.AWS_S3_BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
    }
}
