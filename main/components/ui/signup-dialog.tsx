"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/context/userContext";

interface SignUpDialogProps {
    children: React.ReactNode;
    triggerClassName?: string;
    onDialogOpenChange?: (open: boolean) => void;
}

export function SignUpDialog({
    children,
    triggerClassName,
    onDialogOpenChange,
}: SignUpDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [inputUsername, setInputUsername] = useState(""); // Local state for input
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { username, setUsername, setUserId } = useUserContext();

    const handleGetStarted = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputUsername.trim()) {
            setIsLoading(true);
            try {
                const res = await fetch("/api/createUser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: inputUsername }),
                });
                const newUser = await res.json();

                if (!newUser.ok) {
                    console.error("Error creating user:", newUser);
                    return;
                }

                console.log("New user created:", newUser);

                // Set the user data in context
                setUserId(newUser._id);
                setUsername(newUser.username);

                // Close dialog and clear input
                setIsDialogOpen(false);
                setInputUsername("");

                // Navigate to dashboard
                router.push("/dashboard");
            } catch (error) {
                console.error("Error creating user:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        onDialogOpenChange?.(open);
        // Clear input when dialog closes
        if (!open) {
            setInputUsername("");
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild className={triggerClassName}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Get Started with Finz
                    </DialogTitle>
                </DialogHeader>
                <div className="text-center space-y-4">
                    <p className="text-gray-700">
                        Create your account to start tracking your finances
                        effortlessly.
                    </p>
                    <div className="space-y-4">
                        <Input
                            placeholder="Enter your username"
                            value={inputUsername}
                            onChange={(e) => setInputUsername(e.target.value)}
                            className="w-full"
                            disabled={isLoading}
                        />
                        <Button
                            size="lg"
                            className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                            onSubmit={handleGetStarted}
                            disabled={!inputUsername.trim() || isLoading}
                            type="submit"
                        >
                            {isLoading ? "Creating Account..." : "Sign Up Now"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
