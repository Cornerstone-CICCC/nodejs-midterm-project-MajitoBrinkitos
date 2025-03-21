"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_1 = require("express");
const artwork_controller_1 = require("../controllers/artwork.controller");
const router = (0, express_1.Router)();
//home
router.get('/', artwork_controller_1.home);
//cookies
router.get('/set-cookie', artwork_controller_1.setCookie);
router.get('/check-cookie', artwork_controller_1.checkCookie);
router.get('/clear-cookie', artwork_controller_1.clearCookie);
//art controllers
router.get('/getArtworks', auth_middleware_1.isAuthenticated, artwork_controller_1.getArtworks);
router.get('/:id', auth_middleware_1.isAuthenticated, artwork_controller_1.getArtworkById);
router.post('/createArtwork', auth_middleware_1.isAuthenticated, artwork_controller_1.createArtwork);
router.put('/:id', auth_middleware_1.isAuthenticated, artwork_controller_1.updateArtwork);
router.delete('/:id', auth_middleware_1.isAuthenticated, artwork_controller_1.deleteArtwork);
exports.default = router;
