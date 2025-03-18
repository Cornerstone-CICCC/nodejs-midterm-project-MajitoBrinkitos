"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const artwork_controller_1 = __importDefault(require("../controllers/artwork.controller"));
const artworkRouter = (0, express_1.Router)();
artworkRouter.get('/', artwork_controller_1.default.home);
artworkRouter.get('/set-cookie', artwork_controller_1.default.setCookie);
artworkRouter.get('/check-cookie', artwork_controller_1.default.checkCookie);
artworkRouter.get('/clear-cookie', artwork_controller_1.default.clearCookie);
exports.default = artworkRouter;
