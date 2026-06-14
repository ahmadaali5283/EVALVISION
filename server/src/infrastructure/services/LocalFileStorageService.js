import fs from "node:fs/promises";
import path from "node:path";
import { IFileStorageService } from "../../application/ports/services/IFileStorageService.js";

export class LocalFileStorageService extends IFileStorageService {
  async moveFile(sourcePath, destDir, filename) {
    await fs.mkdir(destDir, { recursive: true });
    const destFile = path.join(destDir, filename);
    await fs.rename(sourcePath, destFile);
    return destFile;
  }

  async deleteFile(filePath) {
    await fs.unlink(filePath).catch(() => {});
  }

  toRelativePath(absolutePath, uploadsRoot) {
    return path.relative(uploadsRoot, absolutePath).split(path.sep).join("/");
  }
}
