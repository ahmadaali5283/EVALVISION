/* eslint-disable no-unused-vars */
export class IFileStorageService {
  async moveFile(sourcePath, destDir, filename) {
    throw new Error("not implemented");
  }

  async deleteFile(filePath) {
    throw new Error("not implemented");
  }

  toRelativePath(absolutePath, uploadsRoot) {
    throw new Error("not implemented");
  }
}
