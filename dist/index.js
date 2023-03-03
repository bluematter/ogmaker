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
const browser_1 = __importDefault(require("./browser"));
const screenshot_1 = __importDefault(require("./screenshot"));
const IS_DEV = process.env.NODE_ENV === "development";
const ogmaker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Methods", "*");
        res.set("Access-Control-Allow-Headers", "*");
        res.status(204).send("");
        return;
    }
    try {
        const { title, type, linkedinUrl, video, fileName } = req.body;
        const { page, browser, rootHandle } = yield (0, browser_1.default)({
            type,
            title,
            video,
            linkedinUrl,
        });
        if (IS_DEV) {
            return res.status(200).send({
                created: true,
            });
        }
        const { uploadedFile } = yield (0, screenshot_1.default)({
            page,
            fileName,
            rootHandle,
        });
        yield browser.close();
        res.status(200).send({
            created: true,
            uploadedFile,
        });
    }
    catch (e) {
        res.status(500).send({
            error: e.message,
        });
    }
});
exports.ogmaker = ogmaker;
