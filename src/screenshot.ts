import { ElementHandle, Page } from "puppeteer";
import upload from "./upload";

interface IScreenshot {
  page: Page;
  fileName?: string;
  rootHandle?: ElementHandle<Element> | null;
}

export default async ({ page, fileName, rootHandle }: IScreenshot) => {
  if (rootHandle) {
    const screenshot: string | void | Buffer = await rootHandle.screenshot({
      encoding: "base64",
      omitBackground: true,
      type: "png",
      captureBeyondViewport: false,
    });

    if (typeof screenshot === "string") {
      const screenshotBuffer = await Buffer.from(screenshot, "base64");

      const uploadedFile = await upload({
        buffer: screenshotBuffer,
        fileName,
      });

      return {
        uploadedFile,
      };
    } else {
      throw new Error("Screenshot is not a string");
    }
  } else {
    if (page) {
      const screenshot: string | void | Buffer = await page.screenshot({
        encoding: "base64",
        omitBackground: true,
        type: "png",
        captureBeyondViewport: false,
      });

      if (typeof screenshot === "string") {
        const screenshotBuffer = await Buffer.from(screenshot, "base64");

        const uploadedFile = await upload({
          buffer: screenshotBuffer,
          fileName,
        });

        return {
          uploadedFile,
        };
      } else {
        throw new Error("Screenshot is not a string");
      }
    } else {
      throw new Error("No root element or page found");
    }
  }
};
