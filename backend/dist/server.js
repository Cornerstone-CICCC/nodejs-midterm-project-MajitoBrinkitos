"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const artwork_routes_1 = __importDefault(require("./routes/artwork.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
/* import cookieSession from 'cookie-session' */
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Create server
const app = (0, express_1.default)();
//Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    //Astro port
    origin: "http://localhost:4321",
    //Cookie transfer
    credentials: true
}));
//Session Middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'you_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: /* process.env.NODE_ENV === 'production' */ false },
}));
// API Routes
app.use('/api/artworks', artwork_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
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
app.get('/', (req, res) => {
    res.status(200).send('Backend is running!');
});
app.use((req, res) => {
    res.status(404).send('Page not found!');
});
//Handle Error
app.use((err, req, res, next) => {
    console.error('Error:', err.message || err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});
//Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
