import 'express-session';

declare module 'express-session' {
    interface Session {
        message?: string;
        user?: {
            _id: string;
            username: string;
            email: string;
        };
    }
}
