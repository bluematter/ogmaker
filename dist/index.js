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
exports.ogmaker = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const html_1 = __importDefault(require("./html"));
const upload_1 = __importDefault(require("./upload"));
const ogmaker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        const browser = yield puppeteer_1.default.launch({
            headless: true,
            args: ["--no-sandbox"],
        });
        const page = yield browser.newPage();
        yield page.setContent((0, html_1.default)({
            title,
        }));
        yield page.waitForSelector(".ready");
        // screenshot
        const pageFrame = page.mainFrame();
        const rootHandle = yield pageFrame.$("#root");
        if (rootHandle) {
            const screenshot = yield rootHandle.screenshot({
                encoding: "base64",
                omitBackground: true,
                type: "jpeg",
                quality: 100,
                captureBeyondViewport: false,
            });
            if (typeof screenshot === "string") {
                const screenshotBuffer = yield Buffer.from(screenshot, "base64");
                const uploadedFile = yield (0, upload_1.default)({
                    buffer: screenshotBuffer,
                });
                res.status(200).send({
                    created: true,
                    uploadedFile,
                });
            }
            else {
                throw new Error("Screenshot is not a string");
            }
        }
        else {
            throw new Error("No root element found");
        }
    }
    catch (e) {
        res.status(500).send({
            error: e.message,
        });
    }
});
exports.ogmaker = ogmaker;
