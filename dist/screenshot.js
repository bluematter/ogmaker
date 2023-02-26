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
const upload_1 = __importDefault(require("./upload"));
exports.default = ({ page, fileName, rootHandle }) => __awaiter(void 0, void 0, void 0, function* () {
    if (rootHandle) {
        const screenshot = yield rootHandle.screenshot({
            encoding: "base64",
            omitBackground: false,
            type: "png",
            captureBeyondViewport: false,
        });
        if (typeof screenshot === "string") {
            const screenshotBuffer = yield Buffer.from(screenshot, "base64");
            const uploadedFile = yield (0, upload_1.default)({
                buffer: screenshotBuffer,
                fileName,
            });
            return {
                uploadedFile,
            };
        }
        else {
            throw new Error("Screenshot is not a string");
        }
    }
    else {
        if (page) {
            const screenshot = yield page.screenshot({
                encoding: "base64",
                omitBackground: true,
                type: "png",
                captureBeyondViewport: false,
            });
            if (typeof screenshot === "string") {
                const screenshotBuffer = yield Buffer.from(screenshot, "base64");
                const uploadedFile = yield (0, upload_1.default)({
                    buffer: screenshotBuffer,
                    fileName,
                });
                return {
                    uploadedFile,
                };
            }
            else {
                throw new Error("Screenshot is not a string");
            }
        }
        else {
            throw new Error("No root element or page found");
        }
    }
});
