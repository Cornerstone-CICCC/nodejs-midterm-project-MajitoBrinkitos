import { Router } from 'express'
import artworkController from '../controllers/artwork.controller'

const artworkRouter = Router()

artworkRouter.get('/', artworkController.home)
artworkRouter.get('/set-cookie', artworkController.setCookie)
artworkRouter.get('/check-cookie', artworkController.checkCookie)
artworkRouter.get('/clear-cookie', artworkController.clearCookie)

export default artworkRouter