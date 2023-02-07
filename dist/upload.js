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
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("@google-cloud/storage");
const uuid_1 = require("uuid");
const storage = new storage_1.Storage();
exports.default = ({ buffer, fileName }) => __awaiter(void 0, void 0, void 0, function* () {
    const fName = fileName ? fileName : (0, uuid_1.v1)() + ".jpg";
    const bucket = storage.bucket("motionbox-og-images");
    const file = bucket.file(fName);
    return {
        fName,
        uploaded: yield file.save(buffer),
    };
});
