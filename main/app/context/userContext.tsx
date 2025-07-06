"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
    username: string;
    userId: string;
    setUsername: (username: string) => void;
    setUserId: (userId: string) => void;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [username, setUsernameState] = useState<string>("");
    const [userId, setUserIdState] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedUsername = localStorage.getItem("finzUsername");
        const storedUserId = localStorage.getItem("finzUserId");

        setUsernameState(storedUsername || "");
        setUserIdState(storedUserId || "");
        setIsLoading(false);
    }, []);

    const setUsername = (newUsername: string) => {
        setUsernameState(newUsername);
        localStorage.setItem("finzUsername", newUsername);
    };

    const setUserId = (newUserId: string) => {
        setUserIdState(newUserId);
        localStorage.setItem("finzUserId", newUserId);
    };

    return (
        <UserContext.Provider
            value={{
                username,
                userId,
                setUsername,
                setUserId,
                isLoading,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider };
