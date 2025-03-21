import { Request, Response, RequestHandler } from 'express';
import { readArtworks, writeArtworks } from '../utils/fileHelpers';

// Home
export const home = (req: Request, res: Response) => {
    res.status(200).send("Welcome to my server!");
};

// Set Cookie
export const setCookie = (req: Request, res: Response) => {
    if (req.session) {
        req.session.message = "Here's your cookie";
    }
    res.status(200).json({
        message: "You got a cookie!"
    });
};

// Check Cookie
export const checkCookie = (req: Request, res: Response) => {
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

// Clear Cookie
export const clearCookie = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
        }
    });
    res.status(200).json({
        content: "Session cookie cleared!"
    });
};

// GET /api/artworks - Retrieve all artworks
export const getArtworks: RequestHandler = (req, res) => {
    const artworks = readArtworks();
    res.status(200).json(artworks);
};

// GET /api/artworks/:id - Retrieve a single artwork by ID
export const getArtworkById: RequestHandler = (req, res) => {
    const { id } = req.params;
    const artworks = readArtworks();

    const artwork = artworks.find(a => a.id === id);
    if (!artwork) {
        res.status(404).json({ error: 'Artwork not found' });
        return;
    }

    res.status(200).json(artwork);
};

// POST /api/artworks - Create a new artwork
export const createArtwork: RequestHandler = (req, res) => {
    const { title, description, imageUrl } = req.body;

    if (!title || !imageUrl) {
        res.status(400).json({ error: 'Title and image URL are required' });
        return;
    }

    const artworks = readArtworks();
    const newArtwork = {
        id: Date.now().toString(), // Generate a unique ID
        title,
        description,
        imageUrl
    };

    artworks.push(newArtwork);
    writeArtworks(artworks);

    res.status(201).json(newArtwork);
};

// PUT /api/artworks/:id - Update an existing artwork
export const updateArtwork: RequestHandler = (req, res) => {
    const { id } = req.params;
    const { title, description, imageUrl } = req.body;

    const artworks = readArtworks();
    const artwork = artworks.find(a => a.id === id);

    if (!artwork) {
        res.status(404).json({ error: 'Artwork not found' });
        return;
    }

    // Update fields
    artwork.title = title || artwork.title;
    artwork.description = description || artwork.description;
    artwork.imageUrl = imageUrl || artwork.imageUrl;

    writeArtworks(artworks);
    res.status(200).json(artwork);
};

// DELETE /api/artworks/:id - Delete an artwork
export const deleteArtwork: RequestHandler = (req, res) => {
    const { id } = req.params;

    const artworks = readArtworks();
    const index = artworks.findIndex(a => a.id === id);

    if (index === -1) {
        res.status(404).json({ error: 'Artwork not found' });
        return;
    }

    artworks.splice(index, 1); // Remove artwork from array
    writeArtworks(artworks);

    res.status(200).json({ success: true, message: 'Artwork deleted successfully' });
};
