import puppeteer from "puppeteer";
import generateHTML from "./html";

interface IBrowser {
  type?: "og" | "linkedin";
  title?: string;
  video?: string;
  linkedinUrl?: string;
}

export default async ({ type, title, video, linkedinUrl }: IBrowser) => {
  const browser = await puppeteer.launch({
    headless: false,
    // args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  if (type === "linkedin" && linkedinUrl) {
    await page.goto(linkedinUrl, { waitUntil: "networkidle0" });
    await page.click(".contextual-sign-in-modal__modal-dismiss");

    return {
      page,
      browser,
    };
  } else {
    await page.setContent(
      generateHTML({
        title,
        video,
      })
    );
    await page.waitForSelector(".ready");

    const pageFrame = page.mainFrame();
    const rootHandle = await pageFrame.$("#root");

    return {
      page,
      browser,
      rootHandle,
    };
  }
};
