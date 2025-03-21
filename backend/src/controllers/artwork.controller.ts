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

// POST /api/artworks - Create a new artwork
export const createArtwork = (req: Request, res: Response) => {
  const { title, description, imageUrl } = req.body;
  const userId = req.session.user?._id;

  if (!title || !imageUrl || !userId) {
      return res.status(400).json({ error: 'Title, image URL, and user session are required' });
  }

  const artworks = readArtworks();
  const newArtwork = {
      id: Date.now().toString(), // Generate a unique ID
      userId,
      title,
      description,
      imageUrl
  };

  artworks.push(newArtwork);
  writeArtworks(artworks);

  res.status(201).json(newArtwork);
};

// get User's Artwork
export const getUserArtworks = (req: Request, res: Response) => {
  const userId = req.session.user?._id;

  if(!userId){
    return res.status(401).json({ error: 'Not access granted. Login into your account' });
  }

  const artworks = readArtworks().filter(artwork => artwork.userId === userId);
  res.status(201).json(artworks);
}

//update artwork
export const updateArtwork = (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.session.user?._id;
  const { title, description, imageUrl } = req.body;

  const artworks = readArtworks();
  const artwork = artworks.find(a => a.id === id && a.userId === userId);

  if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found or unauthorized' });
  }

  artwork.title = title || artwork.title;
  artwork.description = description || artwork.description;
  artwork.imageUrl = imageUrl || artwork.imageUrl;

  writeArtworks(artworks);
  res.status(200).json(artwork);
};

//delete artwork
export const deleteArtwork = (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.session.user?._id;

  const artworks = readArtworks();
  const index = artworks.findIndex(a => a.id === id && a.userId === userId);

  if (index === -1) {
      return res.status(404).json({ error: 'Artwork not found or unauthorized' });
  }

  artworks.splice(index, 1);
  writeArtworks(artworks);

  res.status(200).json({ success: true, message: 'Artwork deleted successfully' });
};

