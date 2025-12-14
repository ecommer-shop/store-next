import { Auth0Client } from '@auth0/nextjs-auth0/server';
/*
// Verifica que las variables están definidas
if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID || 
    !process.env.AUTH0_CLIENT_SECRET || !process.env.APP_BASE_URL) {
    throw new Error('Missing Auth0 environment variables');
}

export const auth0 = new Auth0Client({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    appBaseUrl: process.env.APP_BASE_URL,
    routes: {
        callback: '/api/auth/callback',
        backChannelLogout: "backChannelLogout",
    },
});*/