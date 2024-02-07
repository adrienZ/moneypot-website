import { UTApi } from "uploadthing/server";

export class AssetsService {
  private static utapi = new UTApi({
    apiKey: process.env.UPLOADTHING_SECRET
  });

  private static readonly PROVIDER_CDN_URL = "https://utfs.io/f";

  static async uploadFileFromUrl(imageStr: string): Promise<string> {
    const uploaded = await this.utapi.uploadFilesFromUrl(imageStr);

    if (uploaded.error) {
      throw uploaded.error;
    }

    return uploaded.data.url;
  }

  static async uploadFile(file: File): Promise<string> {
    const uploaded = await this.utapi.uploadFiles(file);

    if (uploaded.error) {
      throw uploaded.error;
    }

    return uploaded.data.url;
  }

  static async deleteFile(fileUrl: string): Promise<boolean | Error> {
    if (!fileUrl.startsWith(this.PROVIDER_CDN_URL)) {
      return new Error("provided fileUrl does not match CDN url");
    }
    const fileKey = fileUrl.replace(this.PROVIDER_CDN_URL + "/", "");

    const deleted = await this.utapi.deleteFiles(fileKey);
    return deleted.success;
  }
}
