import 'dotenv/config';

export const ADMIN = 'Admin';
export const USER = 'User';
export const ISDEV = process.env.NODE_ENV === 'development';
