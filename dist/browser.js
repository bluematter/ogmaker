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
exports.default = ({ title, video }) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        headless: true,
        // args: ["--no-sandbox"],
    });
    const page = yield browser.newPage();
    yield page.setContent((0, html_1.default)({
        title,
        video,
    }));
    yield page.waitForSelector(".ready");
    // screenshot
    const pageFrame = page.mainFrame();
    const rootHandle = yield pageFrame.$("#root");
    return {
        page,
        rootHandle,
    };
});
