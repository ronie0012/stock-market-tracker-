'use server';

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
import {headers} from "next/headers";
export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        console.log('Attempting to sign up user:', email);
        
        const response = await auth.api.signUpEmail({ 
            body: { 
                email, 
                password, 
                name: fullName 
            },
            headers: await headers()
        });

        console.log('Sign up response:', response);

        if(response?.user) {
            try {
                await inngest.send({
                    name: 'app/user.created',
                    data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
                });
                console.log('Inngest event sent successfully');
            } catch (inngestError) {
                console.warn('Inngest event failed, but user was created:', inngestError);
                // Don't fail the signup if Inngest fails
            }
        }

        return { success: true, data: response }
    } catch (e: any) {
        console.error('Sign up failed:', e);
        const errorMessage = e?.message || e?.error?.message || 'Failed to create account';
        return { success: false, error: errorMessage }
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        console.log('Attempting to sign in user:', email);
        
        const response = await auth.api.signInEmail({ 
            body: { 
                email, 
                password 
            },
            headers: await headers()
        });

        console.log('Sign in response:', response);

        return { success: true, data: response }
    } catch (e: any) {
        console.error('Sign in failed:', e);
        const errorMessage = e?.message || e?.error?.message || 'Invalid email or password';
        return { success: false, error: errorMessage }
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
        return { success: true }
    } catch (e: any) {
        console.error('Sign out failed:', e);
        return { success: false, error: 'Sign out failed' }
    }
}
