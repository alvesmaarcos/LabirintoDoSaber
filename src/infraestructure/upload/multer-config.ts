import multer from "multer";

export class Multer {
  static getUploader(fileSizeInMB: number) {
    return multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: fileSizeInMB * 1024 * 1024 },
    });
  }
}
