"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const html_1 = __importDefault(require("./html"));
const IS_DEV = process.env.NODE_ENV === "development";
const li_token = "AQEDAUGiQSEA8IouAAABhqks4TYAAAGGzTllNk4AEBdGi1i6LmcprOjoRIyGbd-gtBh4JB7oM_T2ubsxooTgol6COMzP5mxFcGILYyXzyP-_zexAKf9feL3aoygmNsP6NV9nr8eyOzrW-vwwMPEorud8";
exports.default = ({ type, title, video, linkedinUrl }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const browser = yield puppeteer_1.default.launch(IS_DEV
            ? {
                headless: false,
            }
            : {
                headless: true,
                args: ["--no-sandbox"],
            });
        const page = yield browser.newPage();
        yield page.setViewport({
            width: 1920,
            height: 1080,
        });
        if (type === "linkedin" && linkedinUrl) {
            console.log("GOING TO LINKEDIN");
            yield page.goto("https://www.linkedin.com");
            try {
                console.log("SETTING COOKIE");
                yield page.setCookie({
                    name: "li_at",
                    domain: ".www.linkedin.com",
                    value: li_token,
                });
            }
            catch (e) {
                console.log("Error setting cookie", {
                    e,
                });
                throw new Error(e);
            }
            console.log("GOING TO LINKEDIN LOGGED IN", {
                linkedinUrl,
                cookies: JSON.stringify(yield page.cookies()),
            });
            try {
                console.log("About to open linkedin page", {
                    linkedinUrl,
                });
                yield page.goto(linkedinUrl, {
                    timeout: 60000,
                    waitUntil: "domcontentloaded",
                });
                console.log("Opened linkedin page", {
                    linkedinUrl,
                });
                // Hack to wait for the page to load waitUntil: "networkidle2" seems to not work
                yield new Promise((resolve) => setTimeout(resolve, 15000));
                const hasProfilePicture = yield page.evaluate(() => !!document.querySelector(".pv-top-card-profile-picture"), {
                    timeout: 20000,
                });
                console.log(`hasProfilePicture: ${hasProfilePicture}, linkedinUrl: ${linkedinUrl}`);
                // TODO: Problem is that this is not working, its broken and this is doing nothing
                const isBroken = yield page.$(".artdeco-empty-state__action");
                console.log("Checking for empty state class", {
                    class: isBroken,
                    linkedinUrl,
                });
                if (isBroken !== null) {
                    if ((yield page.$(".artdeco-empty-state__headline--mercado-error-server-large")) !== null) {
                        console.log("THIS PAGE DOESNT EXIST, REPORT IT", {
                            linkedinUrl,
                        });
                    }
                    else {
                        // if has class artdeco-empty-state__action and or global-error press artdeco-empty-state__action
                        console.log("THIS PAGE IS BROKEN, LETS RELOAD", {
                            linkedinUrl,
                        });
                    }
                }
                else {
                    console.log("THIS PAGE SEEMS FINE ABOUT TO SET A TIMEOUT", {
                        linkedinUrl,
                    });
                }
            }
            catch (e) {
                console.log("Error inside pageIssue", {
                    e,
                });
                throw new Error(e);
            }
            console.log("RETRY FUNCTION EXITED SUCCESSFULLY");
            try {
                yield page.evaluate(`document.querySelector(".ad-banner-container")?.remove()`);
            }
            catch (e) {
                console.log("Error clicking button", {
                    e,
                });
            }
            // Add a style to the body tag
            yield page.evaluate(() => {
                document.querySelector("body").style.backgroundColor = "white";
            });
            console.log("READY");
            return {
                page,
                browser,
            };
        }
        else {
            yield page.setContent((0, html_1.default)({
                title,
                video,
            }));
            yield page.waitForSelector(".ready");
            const pageFrame = page.mainFrame();
            const rootHandle = yield pageFrame.$("#root");
            return {
                page,
                browser,
                rootHandle,
            };
        }
    }
    catch (e) {
        console.log("Error creating browser", {
            e,
        });
        throw new Error(e);
    }
});
