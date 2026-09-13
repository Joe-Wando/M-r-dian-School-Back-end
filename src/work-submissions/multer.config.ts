import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import { extname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const UPLOAD_ROOT = join(process.cwd(), 'uploads');

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.zip',
  '.txt',
  '.js',
  '.py',
  '.c',
  '.java',
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Chemin absolu du dossier de stockage pour un sous-dossier donné (créé au besoin). */
export function uploadDir(subdir: string): string {
  const dir = join(UPLOAD_ROOT, subdir);
  mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Options Multer partagées entre l'upload étudiant et le fichier de correction admin.
 * Le nom sur disque est toujours un UUID (jamais dérivé du nom d'origine), pour
 * empêcher de deviner l'URL d'un fichier appartenant à un autre utilisateur.
 */
export function buildMulterOptions(subdir: string) {
  return {
    storage: diskStorage({
      destination: (_req, _file, cb) => cb(null, uploadDir(subdir)),
      filename: (_req, file, cb) => cb(null, `${randomUUID()}${extname(file.originalname)}`),
    }),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (_req: unknown, file: Express.Multer.File, cb: (error: Error | null, accept: boolean) => void) => {
      if (!ALLOWED_EXTENSIONS.has(extname(file.originalname).toLowerCase())) {
        cb(new BadRequestException('Type de fichier non autorisé.'), false);
        return;
      }
      cb(null, true);
    },
  };
}
