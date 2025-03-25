import { Request, Response } from 'express';
import { readArtworks, writeArtworks } from '../utils/fileHelpers';
import path from 'path';

declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File;
        }
    }
}

// Home
export const home = (req: Request, res: Response):void => {
    res.status(200).send("Welcome to my server!");
};

// Set Cookie
export const setCookie = (req: Request, res: Response):void => {
    if (req.session) {
        req.session.message = "Here's your cookie";
    }
    res.status(200).json({ message: "You got a cookie!" });
};

// Check Cookie
export const checkCookie = (req: Request, res: Response): void => {
    if (req.session.message) {
        res.status(200).json({ content: req.session.message });
        return;
    }
    res.status(500).json({
        content: "No cookie found. Keep trying!"
    });
};

// Clear Cookie
export const clearCookie = (req: Request, res: Response): void => {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destruction error:', err);
            res.status(500).json({ error: 'Failed to clear session.' });
            return;
        }
        res.status(200).json({ content: "Session cookie cleared!" });
    });
};

// POST /api/artworks - Create a new artwork
export const createArtwork = (req: Request, res: Response): void => {
    const { title, description } = req.body;
    const userId = req.session.user?._id;
    const imageFile = req.file; // The uploaded file

    if (!title || !imageFile || !userId) {
        res.status(400).json({ error: 'Title, image file, and user session are required.' });
        return;
    }

    const artworks = readArtworks();
    const newArtwork = {
        id: Date.now().toString(),
        userId,
        title,
        description,
        imageUrl: path.join('/uploads', imageFile.filename), // Save the file path
    };

    artworks.push(newArtwork);
    writeArtworks(artworks);
    res.status(201).json(newArtwork);
};

// get User's Artwork
export const getUserArtworks = (req: Request, res: Response):void => {
  const userId = req.session.user?._id;

  if(!userId){
    res.status(401).json({ error: 'Not access granted. Login into your account' });
    return;
  }

  const artworks = readArtworks().filter(artwork => artwork.userId === userId);
  res.status(200).json({ artworks });
}

//update artwork
export const updateArtwork = (req: Request, res: Response): void => {
    const { id } = req.params;
    const userId = req.session.user?._id;
    const { title, description, imageUrl } = req.body;

    const artworks = readArtworks();
    const artwork = artworks.find(a => a.id === id && a.userId === userId);

    if (!artwork) {
        res.status(404).json({ error: 'Artwork not found or unauthorized.' });
        return;
    }

    artwork.title = title || artwork.title;
    artwork.description = description || artwork.description;
    artwork.imageUrl = artwork.imageUrl.replace(/\\/g, '/');

    writeArtworks(artworks);
    res.status(200).json(artwork);
};

//delete artwork
export const deleteArtwork = (req: Request, res: Response): void => {
    const { id } = req.params;
    const userId = req.session.user?._id;

    const artworks = readArtworks();
    const index = artworks.findIndex(a => a.id === id && a.userId === userId);

    if (index === -1) {
        res.status(404).json({ error: 'Artwork not found or unauthorized.' });
        return;
    }

    artworks.splice(index, 1);
    writeArtworks(artworks);
    res.status(200).json({ success: true, message: 'Artwork deleted successfully' });
};

