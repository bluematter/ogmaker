import { HttpFunction } from "@google-cloud/functions-framework";
import puppeteer from "puppeteer";
import generateHTML from "./html";

export const ogmaker: HttpFunction = async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(generateHTML({}));
  await page.waitForSelector(".ready");

  res.status(200).send({
    works: true,
  });
};
