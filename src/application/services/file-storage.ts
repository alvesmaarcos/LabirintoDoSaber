export interface ISaveFileRequest {
  taskId: string;
  file: Express.Multer.File;
}

export interface ISaveFileResponse {
  url: string;
}

export interface FileStorage {
  saveFile({ taskId, file }: ISaveFileRequest): Promise<ISaveFileResponse>;
}
