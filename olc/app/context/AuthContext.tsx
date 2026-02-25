"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
    id?: any;
    _id?: any;
    name: any;
    email: any;
    image?: any;
    token?: any;
}

type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
}
