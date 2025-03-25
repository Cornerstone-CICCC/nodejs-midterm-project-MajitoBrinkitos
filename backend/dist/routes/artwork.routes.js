"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const artwork_controller_1 = require("../controllers/artwork.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
//home
/* router.get('/', home) */
//cookies
router.get('/set-cookie', artwork_controller_1.setCookie);
router.get('/check-cookie', artwork_controller_1.checkCookie);
router.get('/clear-cookie', artwork_controller_1.clearCookie);
//art controllers
router.get('/user', auth_middleware_1.isAuthenticated, artwork_controller_1.getUserArtworks);
router.post('/', auth_middleware_1.isAuthenticated, upload.single('imageFile'), artwork_controller_1.createArtwork);
router.put('/:id', auth_middleware_1.isAuthenticated, artwork_controller_1.updateArtwork);
router.delete('/:id', auth_middleware_1.isAuthenticated, artwork_controller_1.deleteArtwork);
exports.default = router;
