import puppeteer from "puppeteer";
import generateHTML from "./html";

interface IBrowser {
  title?: string;
  video?: string;
}

export default async ({ title, video }: IBrowser) => {
  const browser = await puppeteer.launch({
    headless: true,
    // args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  await page.setContent(
    generateHTML({
      title,
      video,
    })
  );
  await page.waitForSelector(".ready");

  // screenshot
  const pageFrame = page.mainFrame();
  const rootHandle = await pageFrame.$("#root");

  return {
    page,
    rootHandle,
  };
};
