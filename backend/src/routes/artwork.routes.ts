import express, { Router } from 'express'
import multer from 'multer';
import { isAuthenticated } from '../middlewares/auth.middleware';
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
const upload = multer({ dest: 'uploads/' });

//home
/* router.get('/', home) */

//cookies
router.get('/set-cookie', setCookie)
router.get('/check-cookie', checkCookie)
router.get('/clear-cookie', clearCookie)

//art controllers
router.get('/user', isAuthenticated, getUserArtworks)
router.post('/', isAuthenticated, upload.single('imageFile'), createArtwork);
router.put('/:id', isAuthenticated, updateArtwork)
router.delete('/:id', isAuthenticated, deleteArtwork)


export default router;