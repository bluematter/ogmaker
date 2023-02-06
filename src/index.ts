import { HttpFunction } from "@google-cloud/functions-framework";
import puppeteer from "puppeteer";
import generateHTML from "./html";

export const ogmaker: HttpFunction = async (req, res) => {
  try {
    const { title }: any = req.body;

    const browser = await puppeteer.launch({
      headless: false,
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
      } else {
        throw new Error("Screenshot is not a string");
      }
    } else {
      throw new Error("No root element found");
    }

    res.status(200).send({
      works: true,
    });
  } catch (e: any) {
    res.status(500).send({
      error: e.message,
    });
  }
};
