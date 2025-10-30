"use client"

import { User } from "@/lib/type";
import { createContext, useContext } from "react";

const AuthContext = createContext<User | "">("")

export default function AuthProvider({ children, value }: { children: React.ReactNode; value: User }) {
	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		return "";
	}
	return ctx;
}