'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {useRouter} from "next/navigation";
import { useState } from "react";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import NavItems from "@/components/NavItems";
import { signOut as clientSignOut } from "@/lib/better-auth/client";

const UserDropdown = ({ user, initialStocks }: {user: User, initialStocks: StockWithWatchlistStatus[]}) => {
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        if (isSigningOut) return; // Prevent multiple clicks
        
        try {
            setIsSigningOut(true);
            console.log('Attempting to sign out...');
            
            // Clear any local storage or session storage
            if (typeof window !== 'undefined') {
                localStorage.clear();
                sessionStorage.clear();
                console.log('Cleared local and session storage');
            }
            
            // Call our custom signout API (more reliable than client-side)
            try {
                const response = await fetch('/api/signout', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                const result = await response.json();
                console.log('API sign out result:', result);
                
                if (!result.success) {
                    console.error('API sign out failed:', result.error);
                }
            } catch (apiError) {
                console.error('API signout failed:', apiError);
            }
            
            // Try client-side signout as backup
            try {
                await clientSignOut();
                console.log('Client-side sign out successful');
            } catch (clientError) {
                console.log('Client-side sign out failed:', clientError);
            }
            
            // Clear all cookies manually on client side
            if (typeof document !== 'undefined') {
                document.cookie.split(";").forEach(function(c) { 
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
                });
                console.log('Cleared all client-side cookies');
            }
            
            console.log('Redirecting to sign-in page...');
            
            // Force immediate redirect without using router
            window.location.replace("/sign-in");
            
        } catch (error) {
            console.error('Sign out completely failed:', error);
            // Even if everything fails, still redirect to sign-in
            window.location.replace("/sign-in");
        } finally {
            setIsSigningOut(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://avatars.githubusercontent.com/u/153423955?s=280&v=4" />
                        <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                            {user.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className='text-base font-medium text-gray-400'>
                            {user.name}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-gray-400">
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="https://avatars.githubusercontent.com/u/153423955?s=280&v=4" />
                            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                {user.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className='text-base font-medium text-gray-400'>
                                {user.name}
                            </span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600"/>
                <DropdownMenuItem 
                    onClick={handleSignOut} 
                    disabled={isSigningOut}
                    className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
                    {isSigningOut ? 'Signing out...' : 'Logout'}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="hidden sm:block bg-gray-600"/>
                <nav className="sm:hidden">
                    <NavItems initialStocks={initialStocks} />
                </nav>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default UserDropdown
