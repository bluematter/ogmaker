import { HttpFunction } from "@google-cloud/functions-framework";
import browser from "./browser";
import screenshot from "./screenshot";

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
    const { title, fileName }: any = req.body;

    const { rootHandle } = await browser({
      title,
    });

    const { uploadedFile } = await screenshot({
      fileName,
      rootHandle,
    });

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
