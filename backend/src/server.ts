import express, { Request, Response } from 'express'
import cookieSession from 'cookie-session'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

//Create server
const app = express()

//Middlewares
app.use(cors({
    //Astro port
    origin: "http://localhost:4321",
    //Cookie transfer
    credentials: true
}))

app.use(express.json())
const SIGN_KEY = process.env.COOKIE_SIGN_KEY
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY
if (!SIGN_KEY || !ENCRYPT_KEY) {
    throw new Error("No cookies found!")
}
app.use(cookieSession({
    name: 'session',
    keys:[SIGN_KEY, ENCRYPT_KEY],
    maxAge: 5 * 60 * 1000
}))

//Routes
app.use((req: Request, res: Response) => {
    res.status(404).send('Page not found!')
})

//Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`)
})