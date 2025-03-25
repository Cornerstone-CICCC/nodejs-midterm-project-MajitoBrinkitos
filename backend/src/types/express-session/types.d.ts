import 'express-session';

declare module 'express-session' {
    interface SessionData {
        user?: {
            _id: string;
            username: string;
            email: string;
        };
    }
}

declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File;
        }
    }
}
