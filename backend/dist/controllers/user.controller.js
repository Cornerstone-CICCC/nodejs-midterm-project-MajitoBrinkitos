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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
const fileHelpers_1 = require("../utils/fileHelpers");
//POST /api/users/signup - Register a new user
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Read existing users
        const users = (0, fileHelpers_1.readUsers)();
        // Check for duplicate emails
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            res.status(400).json({ error: 'User with this email already exists' });
            return;
        }
        // Create new user object
        const newUser = {
            _id: Date.now().toString(), // Unique ID
            username,
            email,
            password, // For simplicity; add hashing later
        };
        // Add new user to the list and save
        users.push(newUser);
        (0, fileHelpers_1.writeUsers)(users);
        // Respond with user data (exclude password)
        const userResponse = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        };
        req.session.user = userResponse;
        res.status(201).json(userResponse);
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
//POST /api/users/login - Log in a user
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Read existing users
        const users = (0, fileHelpers_1.readUsers)();
        // Find user by email
        const user = users.find(user => user.email === email);
        if (!user || user.password !== password) { // Simple password check
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Respond with user data (exclude password)
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };
        req.session.user = userResponse;
        res.status(200).json(userResponse);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
//GET /api/users/logout - Log out a user
const logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
};
exports.logout = logout;
