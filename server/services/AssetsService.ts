import { UTApi } from "uploadthing/server";

export class AssetsService {
  private static utapi = new UTApi({
    apiKey: process.env.UPLOADTHING_SECRET
  });

  static async uploadFile(imageStr: string): Promise<string> {
    const uploaded = await this.utapi.uploadFilesFromUrl(imageStr);

    if (uploaded.error) {
      throw uploaded.error;
    }

    return uploaded.data.url;
  }
}
