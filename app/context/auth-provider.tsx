"use client"

import { User } from "@/lib/type";
import { createContext, useContext, useMemo } from "react";

type AuthContextType = User | null

const AuthContext = createContext<AuthContextType>(null)

export default function AuthProvider({
	children,
	value,
}: {
	children: React.ReactNode
	/** current authenticated user, or null when unauthenticated */
	value?: User | null
}) {
	// memoize to avoid re-rendering consumers when parent re-renders
	const memo = useMemo(() => value ?? null, [value])

	return <AuthContext.Provider value={memo}>{children}</AuthContext.Provider>
}

/**
 * Hook to access the current authenticated user (or null).
 * Returns: User | null
 */
export function useAuth(): AuthContextType {
	const ctx = useContext(AuthContext)
	return ctx
}