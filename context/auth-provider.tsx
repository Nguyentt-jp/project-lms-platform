"use client"

import { User } from "@/lib/type";
import { createContext, useContext } from "react";

type AuthContextType = User | null

interface IAuthProviderProps {
	children: React.ReactNode
	session?: User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({ children, session }: IAuthProviderProps) {
	return (
		<AuthContext.Provider value={session ?? null}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}