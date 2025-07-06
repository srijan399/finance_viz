"use client";

import { useState } from "react";
import {
    Search,
    // Filter,
    Download,
    Bell,
    ChevronDown,
    Menu,
    Sparkles,
    TrendingUp,
    DollarSign,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface HeaderProps {
    activeTab: string;
    setSidebarOpen: (open: boolean) => void;
    onSearch?: (query: string) => void;
    onFilter?: () => void;
    onExport?: () => void;
}

const Header = ({
    activeTab,
    setSidebarOpen,
    onSearch,
    // onFilter,
    onExport,
}: HeaderProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const router = useRouter();

    const getTabTitle = (tab: string) => {
        switch (tab) {
            case "dashboard":
                return "Dashboard";
            case "transactions":
                return "Transactions";
            case "activity":
                return "Activity";
            case "analytics":
                return "Analytics";
            case "settings":
                return "Settings";
            default:
                return "Dashboard";
        }
    };

    const getTabIcon = (tab: string) => {
        switch (tab) {
            case "dashboard":
                return <TrendingUp className="w-6 h-6" />;
            case "transactions":
                return <DollarSign className="w-6 h-6" />;
            case "activity":
                return <Sparkles className="w-6 h-6" />;
            default:
                return <TrendingUp className="w-6 h-6" />;
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(searchQuery);
    };

    const username = localStorage.getItem("finzUsername");
    const userId = localStorage.getItem("finzUserId");

    if (!username || !userId) {
        alert("User not found in localStorage");
        router.push("/");
    }

    const handleSignOut = () => {
        localStorage.removeItem("finzUsername");
        localStorage.removeItem("finzUserId");
        router.push("/");
    };

    return (
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 opacity-50"></div>

            {/* Header content */}
            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Tab title with icon */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                                {getTabIcon(activeTab)}
                            </div>
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                                    {getTabTitle(activeTab)}
                                </h1>
                                <p className="text-sm text-gray-600 hidden sm:block">
                                    {activeTab === "dashboard" &&
                                        "Overview of your finances"}
                                    {activeTab === "transactions" &&
                                        "Manage your transactions"}
                                    {activeTab === "activity" &&
                                        "Recent activity"}
                                    {activeTab === "analytics" &&
                                        "Financial insights"}
                                    {activeTab === "settings" &&
                                        "Account settings"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Search - Hidden on mobile unless toggled */}
                        {!showMobileSearch ? (
                            <>
                                <div className="relative hidden md:block">
                                    <form onSubmit={handleSearch}>
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search transactions..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="pl-10 w-60 lg:w-80 bg-white/80 border-gray-200 backdrop-blur-sm focus:bg-white transition-colors"
                                        />
                                    </form>
                                </div>

                                {/* Mobile search toggle */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                    onClick={() => setShowMobileSearch(true)}
                                >
                                    <Search className="w-5 h-5" />
                                </Button>
                            </>
                        ) : (
                            /* Mobile search input */
                            <div className="flex-1 relative md:hidden">
                                <form onSubmit={handleSearch}>
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search transactions..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-10 pr-10 w-full bg-white/80 border-gray-200"
                                        autoFocus
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                                        onClick={() =>
                                            setShowMobileSearch(false)
                                        }
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        )}

                        {/* Action buttons - Hidden on mobile when search is active */}
                        {!showMobileSearch && (
                            <>
                                <Button
                                    variant="outline"
                                    className="gap-2 bg-white/80 hover:bg-white border-gray-200 backdrop-blur-sm hidden md:flex"
                                    onClick={onExport}
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="hidden lg:inline">
                                        Export
                                    </span>
                                </Button>

                                <div className="flex items-center gap-2 lg:gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="relative hover:bg-white/80"
                                    >
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="flex items-center gap-2 hover:bg-white/80 p-2"
                                            >
                                                <Avatar className="w-8 h-8">
                                                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold">
                                                        {username
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-gray-700 hidden sm:inline">
                                                    {username}
                                                </span>
                                                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:inline" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-56"
                                        >
                                            <DropdownMenuItem>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium">
                                                        {username}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        User ID:{" "}
                                                        {userId?.split("-")[0]}
                                                    </p>
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Settings
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Help
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => {
                                                    handleSignOut();
                                                }}
                                            >
                                                Sign out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
