import { Request, Response } from 'express';
import { readUsers, writeUsers } from '../utils/fileHelpers';
import bcrypt from 'bcrypt';

//POST /api/users/signup - Register a new user
export const signup = async (req: Request, res: Response): Promise<void> => {
    try{
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        // Read existing users
        const users = readUsers();

        // Check for duplicate emails
        const isDuplicate = users.some(user => user.email === email);

        if (isDuplicate) {
            res.status(400).json({ error: 'Email is already registered.' });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object
        const newUser = {
            _id: Date.now().toString(),
            username,
            email,
            password: hashedPassword, // Store hashed password
        };

        // Add the user and save
        users.push(newUser);
        writeUsers(users);

        res.status(201).json({ message: 'User created successfully', user: newUser});
    } catch(error) {
        res.status(500).json({ error: 'Signup failed due to server error.' });
    }
};


//POST /api/users/login - Log in a user
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required.' });
            return;
        }

        // Fetch users
        const users = readUsers();
        const user = users.find(user => user.email === email);

        if (!user) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
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
    } catch (error) {
        res.status(500).json({ error: 'Login failed due to server error.' });
    }
};
