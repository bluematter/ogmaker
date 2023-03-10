import { HttpFunction } from "@google-cloud/functions-framework";
import createBrowser from "./browser";
import screenshot from "./screenshot";

const IS_DEV = process.env.NODE_ENV === "development";

interface IPayload {
  title: string;
  video: string;
  fileName: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  type?: "og" | "linkedin" | "website";
}

export const ogmaker: HttpFunction = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "*");
    res.set("Access-Control-Allow-Headers", "*");
    res.status(204).send("");
    return;
  }

  try {
    const { title, type, websiteUrl, linkedinUrl, video, fileName }: IPayload =
      req.body;

    const { page, browser, rootHandle } = await createBrowser({
      type: type ? type : "og",
      title,
      video,
      websiteUrl,
      linkedinUrl,
    });

    if (IS_DEV) {
      return res.status(200).send({
        created: true,
      });
    }

    const { uploadedFile } = await screenshot({
      page,
      fileName,
      rootHandle,
    });

    await browser.close();

    res.status(200).send({
      created: true,
      uploadedFile,
    });
  } catch (e: any) {
    res.status(500).send({
      error: e.message,
    });
  }
};
