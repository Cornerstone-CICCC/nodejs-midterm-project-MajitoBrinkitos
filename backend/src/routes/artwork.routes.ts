import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { Router } from 'express'
import {
    home,
    setCookie,
    checkCookie,
    clearCookie,
    getUserArtworks,
    createArtwork,
    updateArtwork,
    deleteArtwork
} from '../controllers/artwork.controller';

const router = Router()

//home
router.get('/', home)

//cookies
router.get('/set-cookie', setCookie)
router.get('/check-cookie', checkCookie)
router.get('/clear-cookie', clearCookie)

//art controllers
router.get('/getUserArtworks', isAuthenticated, getUserArtworks)
router.post('/createArtwork', isAuthenticated, createArtwork)
router.put('/:id', isAuthenticated, updateArtwork)
router.delete('/:id', isAuthenticated, deleteArtwork)


export default router;