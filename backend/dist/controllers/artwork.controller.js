"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArtwork = exports.updateArtwork = exports.getUserArtworks = exports.createArtwork = exports.clearCookie = exports.checkCookie = exports.setCookie = exports.home = void 0;
const fileHelpers_1 = require("../utils/fileHelpers");
// Home
const home = (req, res) => {
    res.status(200).send("Welcome to my server!");
};
exports.home = home;
// Set Cookie
const setCookie = (req, res) => {
    if (req.session) {
        req.session.message = "Here's your cookie";
    }
    res.status(200).json({
        message: "You got a cookie!"
    });
};
exports.setCookie = setCookie;
// Check Cookie
const checkCookie = (req, res) => {
    if (req.session && req.session.message) {
        res.status(200).json({
            content: req.session.message
        });
        return;
    }
    res.status(500).json({
        content: "No cookie found. Keep trying!"
    });
};
exports.checkCookie = checkCookie;
// Clear Cookie
const clearCookie = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
        }
    });
    res.status(200).json({
        content: "Session cookie cleared!"
    });
};
exports.clearCookie = clearCookie;
// POST /api/artworks - Create a new artwork
const createArtwork = (req, res) => {
    var _a;
    const { title, description, imageUrl } = req.body;
    const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!title || !imageUrl || !userId) {
        return res.status(400).json({ error: 'Title, image URL, and user session are required' });
    }
    const artworks = (0, fileHelpers_1.readArtworks)();
    const newArtwork = {
        id: Date.now().toString(), // Generate a unique ID
        userId,
        title,
        description,
        imageUrl
    };
    artworks.push(newArtwork);
    (0, fileHelpers_1.writeArtworks)(artworks);
    res.status(201).json(newArtwork);
};
exports.createArtwork = createArtwork;
// get User's Artwork
const getUserArtworks = (req, res) => {
    var _a;
    const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        return res.status(401).json({ error: 'Not access granted. Login into your account' });
    }
    const artworks = (0, fileHelpers_1.readArtworks)().filter(artwork => artwork.userId === userId);
    res.status(201).json(artworks);
};
exports.getUserArtworks = getUserArtworks;
//update artwork
const updateArtwork = (req, res) => {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id;
    const { title, description, imageUrl } = req.body;
    const artworks = (0, fileHelpers_1.readArtworks)();
    const artwork = artworks.find(a => a.id === id && a.userId === userId);
    if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found or unauthorized' });
    }
    artwork.title = title || artwork.title;
    artwork.description = description || artwork.description;
    artwork.imageUrl = imageUrl || artwork.imageUrl;
    (0, fileHelpers_1.writeArtworks)(artworks);
    res.status(200).json(artwork);
};
exports.updateArtwork = updateArtwork;
//delete artwork
const deleteArtwork = (req, res) => {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id;
    const artworks = (0, fileHelpers_1.readArtworks)();
    const index = artworks.findIndex(a => a.id === id && a.userId === userId);
    if (index === -1) {
        return res.status(404).json({ error: 'Artwork not found or unauthorized' });
    }
    artworks.splice(index, 1);
    (0, fileHelpers_1.writeArtworks)(artworks);
    res.status(200).json({ success: true, message: 'Artwork deleted successfully' });
};
exports.deleteArtwork = deleteArtwork;
