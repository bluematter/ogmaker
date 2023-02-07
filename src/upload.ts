import { Storage } from "@google-cloud/storage";
import { v1 as uuid } from "uuid";

interface IUpload {
  buffer: Buffer;
  fileName?: string;
}

const storage = new Storage();

export default async ({ buffer, fileName }: IUpload) => {
  const fName = fileName ? fileName : uuid() + ".jpg";
  const bucket = storage.bucket("motionbox-og-images");
  const file = bucket.file(fName);

  return {
    fName,
    uploaded: await file.save(buffer),
  };
};
