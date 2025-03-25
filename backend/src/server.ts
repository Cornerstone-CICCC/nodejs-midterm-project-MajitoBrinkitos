import express, { Request, Response, NextFunction } from 'express'
import session from 'express-session';
import path from 'path';
import artworkRoutes from './routes/artwork.routes';
import userRoutes from './routes/user.routes';
/* import cookieSession from 'cookie-session' */
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

//Create server
const app = express()

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    //Astro port
    origin: "http://localhost:4321",
    //Cookie transfer
    credentials: true
}));

//Session Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'you_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: /* process.env.NODE_ENV === 'production' */ false },
    })
);

// API Routes
app.use('/api/artworks', artworkRoutes);
app.use('/api/users', userRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


//Cookie Settings


/* const SIGN_KEY = process.env.COOKIE_SIGN_KEY
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY
if (!SIGN_KEY || !ENCRYPT_KEY) {
    throw new Error("No cookies found!")
}
app.use(cookieSession({
    name: 'session',
    keys:[SIGN_KEY, ENCRYPT_KEY],
    maxAge: 5 * 60 * 1000
})) */



//Routes
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Backend is running!');
});

app.use((req: Request, res: Response) => {
    res.status(404).send('Page not found!')
})


//Handle Error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message || err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});


//Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`)
})