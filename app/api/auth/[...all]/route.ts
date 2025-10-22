import { getAuth } from "@/lib/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

export async function GET(request: Request) {
    try {
        const auth = await getAuth();
        const handler = toNextJsHandler(auth);
        return await handler.GET(request);
    } catch (error) {
        console.error('Auth GET error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await getAuth();
        const handler = toNextJsHandler(auth);
        return await handler.POST(request);
    } catch (error) {
        console.error('Auth POST error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}