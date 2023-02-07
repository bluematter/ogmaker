import { HttpFunction } from "@google-cloud/functions-framework";
import puppeteer from "puppeteer";
import generateHTML from "./html";
import upload from "./upload";

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

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(
      generateHTML({
        title,
      })
    );
    await page.waitForSelector(".ready");

    // screenshot
    const pageFrame = page.mainFrame();
    const rootHandle = await pageFrame.$("#root");

    if (rootHandle) {
      const screenshot: string | void | Buffer = await rootHandle.screenshot({
        encoding: "base64",
        omitBackground: true,
        type: "jpeg",
        quality: 100,
        captureBeyondViewport: false,
      });

      if (typeof screenshot === "string") {
        const screenshotBuffer = await Buffer.from(screenshot, "base64");

        const uploadedFile = await upload({
          buffer: screenshotBuffer,
          fileName,
        });

        res.status(200).send({
          created: true,
          uploadedFile,
        });
      } else {
        throw new Error("Screenshot is not a string");
      }
    } else {
      throw new Error("No root element found");
    }
  } catch (e: any) {
    res.status(500).send({
      error: e.message,
    });
  }
};
