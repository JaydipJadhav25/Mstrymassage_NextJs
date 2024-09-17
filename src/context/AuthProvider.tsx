"use client"

import { SessionProvider } from "next-auth/react"



function AuthProviders({
    children
} :{ children : React.ReactNode})
{
    return (
        <SessionProvider>
        {
            children
        }
        </SessionProvider>
    )
    
}

export default AuthProviders;