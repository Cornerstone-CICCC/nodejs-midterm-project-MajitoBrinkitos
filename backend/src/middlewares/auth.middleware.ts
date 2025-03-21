import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    if (req.session && req.session.user){
        return next();
    }
    res.status(401).json({ error: 'No access. Please log in'});
};