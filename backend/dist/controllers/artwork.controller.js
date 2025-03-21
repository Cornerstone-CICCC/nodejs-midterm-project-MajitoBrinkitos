"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArtwork = exports.updateArtwork = exports.createArtwork = exports.getArtworkById = exports.getArtworks = exports.clearCookie = exports.checkCookie = exports.setCookie = exports.home = void 0;
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
// GET /api/artworks - Retrieve all artworks
const getArtworks = (req, res) => {
    const artworks = (0, fileHelpers_1.readArtworks)();
    res.status(200).json(artworks);
};
exports.getArtworks = getArtworks;
// GET /api/artworks/:id - Retrieve a single artwork by ID
const getArtworkById = (req, res) => {
    const { id } = req.params;
    const artworks = (0, fileHelpers_1.readArtworks)();
    const artwork = artworks.find(a => a.id === id);
    if (!artwork) {
        res.status(404).json({ error: 'Artwork not found' });
        return;
    }
    res.status(200).json(artwork);
};
exports.getArtworkById = getArtworkById;
// POST /api/artworks - Create a new artwork
const createArtwork = (req, res) => {
    const { title, description, imageUrl } = req.body;
    if (!title || !imageUrl) {
        res.status(400).json({ error: 'Title and image URL are required' });
        return;
    }
    const artworks = (0, fileHelpers_1.readArtworks)();
    const newArtwork = {
        id: Date.now().toString(), // Generate a unique ID
        title,
        description,
        imageUrl
    };
    artworks.push(newArtwork);
    (0, fileHelpers_1.writeArtworks)(artworks);
    res.status(201).json(newArtwork);
};
exports.createArtwork = createArtwork;
// PUT /api/artworks/:id - Update an existing artwork
const updateArtwork = (req, res) => {
    const { id } = req.params;
    const { title, description, imageUrl } = req.body;
    const artworks = (0, fileHelpers_1.readArtworks)();
    const artwork = artworks.find(a => a.id === id);
    if (!artwork) {
        res.status(404).json({ error: 'Artwork not found' });
        return;
    }
    // Update fields
    artwork.title = title || artwork.title;
    artwork.description = description || artwork.description;
    artwork.imageUrl = imageUrl || artwork.imageUrl;
    (0, fileHelpers_1.writeArtworks)(artworks);
    res.status(200).json(artwork);
};
exports.updateArtwork = updateArtwork;
// DELETE /api/artworks/:id - Delete an artwork
const deleteArtwork = (req, res) => {
    const { id } = req.params;
    const artworks = (0, fileHelpers_1.readArtworks)();
    const index = artworks.findIndex(a => a.id === id);
    if (index === -1) {
        res.status(404).json({ error: 'Artwork not found' });
        return;
    }
    artworks.splice(index, 1); // Remove artwork from array
    (0, fileHelpers_1.writeArtworks)(artworks);
    res.status(200).json({ success: true, message: 'Artwork deleted successfully' });
};
exports.deleteArtwork = deleteArtwork;
