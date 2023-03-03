import puppeteer from "puppeteer";
import generateHTML from "./html";

const IS_DEV = process.env.NODE_ENV === "development";

const li_token =
  "AQEDAUGiQSEA8IouAAABhqks4TYAAAGGzTllNk4AEBdGi1i6LmcprOjoRIyGbd-gtBh4JB7oM_T2ubsxooTgol6COMzP5mxFcGILYyXzyP-_zexAKf9feL3aoygmNsP6NV9nr8eyOzrW-vwwMPEorud8";

interface IBrowser {
  type?: "og" | "linkedin";
  title?: string;
  video?: string;
  linkedinUrl?: string;
}

export default async ({ type, title, video, linkedinUrl }: IBrowser) => {
  try {
    const browser = await puppeteer.launch(
      IS_DEV
        ? {
            headless: false,
          }
        : {
            headless: true,
            args: ["--no-sandbox"],
          }
    );
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    if (type === "linkedin" && linkedinUrl) {
      console.log("GOING TO LINKEDIN");
      await page.goto("https://www.linkedin.com");

      try {
        console.log("SETTING COOKIE");

        await page.setCookie({
          name: "li_at",
          domain: ".www.linkedin.com",
          value: li_token,
        });
      } catch (e: any) {
        console.log("Error setting cookie", {
          e,
        });

        throw new Error(e);
      }

      console.log("GOING TO LINKEDIN LOGGED IN", {
        linkedinUrl,
        cookies: JSON.stringify(await page.cookies()),
      });

      try {
        console.log("About to open linkedin page", {
          linkedinUrl,
        });
        await page.goto(linkedinUrl, {
          timeout: 60000,
          waitUntil: "domcontentloaded",
        });
        console.log("Opened linkedin page", {
          linkedinUrl,
        });

        // Hack to wait for the page to load waitUntil: "networkidle2" seems to not work
        await new Promise((resolve) => setTimeout(resolve, 15000));

        const hasProfilePicture = await page.evaluate(
          () => !!document.querySelector(".pv-top-card-profile-picture"),
          {
            timeout: 20000,
          }
        );

        console.log(
          `hasProfilePicture: ${hasProfilePicture}, linkedinUrl: ${linkedinUrl}`
        );

        // TODO: Problem is that this is not working, its broken and this is doing nothing
        const isBroken = await page.$(".artdeco-empty-state__action");

        console.log("Checking for empty state class", {
          class: isBroken,
          linkedinUrl,
        });

        if (isBroken !== null) {
          if (
            (await page.$(
              ".artdeco-empty-state__headline--mercado-error-server-large"
            )) !== null
          ) {
            console.log("THIS PAGE DOESNT EXIST, REPORT IT", {
              linkedinUrl,
            });
          } else {
            // if has class artdeco-empty-state__action and or global-error press artdeco-empty-state__action
            console.log("THIS PAGE IS BROKEN, LETS RELOAD", {
              linkedinUrl,
            });
          }
        } else {
          console.log("THIS PAGE SEEMS FINE ABOUT TO SET A TIMEOUT", {
            linkedinUrl,
          });
        }
      } catch (e: any) {
        console.log("Error inside pageIssue", {
          e,
        });

        throw new Error(e);
      }

      console.log("RETRY FUNCTION EXITED SUCCESSFULLY");

      try {
        await page.evaluate(
          `document.querySelector(".ad-banner-container")?.remove()`
        );
      } catch (e: any) {
        console.log("Error clicking button", {
          e,
        });
      }

      // Add a style to the body tag
      await page.evaluate(() => {
        (document as any).querySelector("body").style.backgroundColor = "white";
      });

      console.log("READY");

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
  } catch (e: any) {
    console.log("Error creating browser", {
      e,
    });

    throw new Error(e);
  }
};
