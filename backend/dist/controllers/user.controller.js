"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const fileHelpers_1 = require("../utils/fileHelpers");
const bcrypt_1 = __importDefault(require("bcrypt"));
//POST /api/users/signup - Register a new user
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }
        // Read existing users
        const users = (0, fileHelpers_1.readUsers)();
        // Check for duplicate emails
        const isDuplicate = users.some(user => user.email === email);
        if (isDuplicate) {
            res.status(400).json({ error: 'Email is already registered.' });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create new user object
        const newUser = {
            _id: Date.now().toString(),
            username,
            email,
            password: hashedPassword, // Store hashed password
        };
        // Add the user and save
        users.push(newUser);
        (0, fileHelpers_1.writeUsers)(users);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    }
    catch (error) {
        res.status(500).json({ error: 'Signup failed due to server error.' });
    }
});
exports.signup = signup;
//POST /api/users/login - Log in a user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required.' });
            return;
        }
        // Fetch users
        const users = (0, fileHelpers_1.readUsers)();
        const user = users.find(user => user.email === email);
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }
        // Verify password
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }
        // Set the user session
        req.session.user = {
            _id: user.id,
            username: user.username,
            email: user.email,
        };
        res.status(200).json({ message: 'Login successful', user: req.session.user });
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed due to server error.' });
    }
});
exports.login = login;
