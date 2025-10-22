import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectToDatabase} from "@/database/mongoose";
import { nextCookies} from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if(authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if(!db) throw new Error('MongoDB connection not found');

    authInstance = betterAuth({
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: false,
        },
        plugins: [nextCookies()],
    });

    return authInstance;
}

// Create a lazy-loaded auth instance
export const auth = {
    api: {
        getSession: async (options: any) => {
            const authInstance = await getAuth();
            return authInstance.api.getSession(options);
        },
        signUpEmail: async (options: any) => {
            const authInstance = await getAuth();
            return authInstance.api.signUpEmail(options);
        },
        signInEmail: async (options: any) => {
            const authInstance = await getAuth();
            return authInstance.api.signInEmail(options);
        },
        signOut: async (options: any) => {
            const authInstance = await getAuth();
            return authInstance.api.signOut(options);
        }
    }
};
