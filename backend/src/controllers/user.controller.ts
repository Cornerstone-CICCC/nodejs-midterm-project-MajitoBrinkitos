import { Request, Response, NextFunction, RequestHandler } from 'express';
import { readUsers, writeUsers } from '../utils/fileHelpers';

//POST /api/users/signup - Register a new user
export const signup: RequestHandler = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Read existing users
        const users = readUsers();

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
        writeUsers(users);

        // Respond with user data (exclude password)
        const userResponse = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        };
        req.session.user = userResponse;
        res.status(201).json(userResponse);
    } catch (error) {
        next(error);
    }
};

//POST /api/users/login - Log in a user
export const login: RequestHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Read existing users
        const users = readUsers();

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
    } catch (error) {
        next(error);
    }
};

//GET /api/users/logout - Log out a user
export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

