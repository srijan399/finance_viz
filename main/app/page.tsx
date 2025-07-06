"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignUpDialog } from "@/components/ui/signup-dialog";
import {
    BarChart3,
    Shield,
    Zap,
    TrendingUp,
    Star,
    Menu,
    X,
    ChevronRight,
    Eye,
    Play,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FinzLanding() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

    const handleDirectNavigation = () => {
        router.push("/dashboard");
    };

    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
    };

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const checkStatus = () => {
        const username = localStorage.getItem("finzUsername");
        const userId = localStorage.getItem("finzUserId");
        if (username && userId) {
            handleDirectNavigation();
        } else {
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-indigo-50 relative overflow-hidden">
            {/* Backdrop blur overlay when dialog is open */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
            )}

            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-200/80 via-pink-100/20 to-blue-100/20" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl" />

            {/* Fixed Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrollY > 50
                        ? "backdrop-blur-3xl bg-white/40 border-b border-white/50 shadow-2xl"
                        : "backdrop-blur-2xl bg-white/30 shadow-xl"
                }`}
                style={{
                    boxShadow:
                        scrollY > 50
                            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3)"
                            : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.2)",
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-900 to-rose-600 rounded-lg flex items-center justify-center shadow-lg">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-900 to-rose-900 bg-clip-text text-transparent">
                                Finz
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                href="#about"
                                className="text-gray-800 font-medium hover:text-purple-700 transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href="#features"
                                className="text-gray-800 font-medium hover:text-purple-700 transition-colors"
                            >
                                Features
                            </Link>
                            <Link
                                href="#pricing"
                                className="text-gray-800 font-medium hover:text-purple-700 transition-colors"
                            >
                                Pricing
                            </Link>
                            <Link
                                href="#dashboard"
                                className="text-gray-800 font-medium hover:text-purple-700 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <SignUpDialog
                                onDialogOpenChange={handleDialogOpenChange}
                            >
                                <Button className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                                    Get Started
                                </Button>
                            </SignUpDialog>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-lg backdrop-blur-sm bg-white/20 border border-white/30 text-gray-800"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden backdrop-blur-xl bg-white/30 border-t border-white/30 shadow-lg">
                        <div className="px-4 py-4 space-y-4">
                            <Link
                                href="#about"
                                className="block text-gray-800 font-medium hover:text-purple-700 transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href="#features"
                                className="block text-gray-800 font-medium hover:text-purple-700 transition-colors"
                            >
                                Features
                            </Link>
                            <Link
                                href="#pricing"
                                className="block text-gray-800 font-medium hover:text-purple-700 transition-colors"
                            >
                                Pricing
                            </Link>
                            <Link
                                href="#dashboard"
                                className="block text-gray-800 font-medium hover:text-purple-700 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <SignUpDialog
                                onDialogOpenChange={handleDialogOpenChange}
                            >
                                <Button className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white border-0 font-semibold">
                                    Get Started
                                </Button>
                            </SignUpDialog>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-8 px-3 sm:px-4 lg:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge className="mb-6 backdrop-blur-xl bg-gradient-to-r from-purple-200/80 to-rose-200/80 text-purple-900 border-purple-300/60 hover:from-purple-200/90 hover:to-pink-200/90 transition-all duration-300 font-semibold shadow-lg">
                            ✨ Your Financial Journey Starts Here
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent leading-tight drop-shadow-sm">
                            Your Finances,
                            <br />
                            Crystal Clear.
                        </h1>
                        <p className="text-xl text-slate-800 font-bold mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
                            Track your spending. Visualize trends. Take control
                            of your money with Finz. The most intuitive personal
                            finance platform designed for modern life.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <SignUpDialog
                                onDialogOpenChange={handleDialogOpenChange}
                            >
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group font-semibold backdrop-blur-sm"
                                    onClick={() => checkStatus()}
                                >
                                    Start Tracking
                                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </SignUpDialog>
                            <Button
                                size="lg"
                                variant="outline"
                                className="backdrop-blur-xl bg-white/40 border-white/60 hover:bg-white/60 transition-all duration-300 group text-slate-900 font-semibold shadow-lg hover:shadow-xl"
                            >
                                <Play className="mr-2 w-4 h-4" />
                                View Demo
                            </Button>
                        </div>
                    </div>

                    {/* Hero Mockup */}
                    <div className="relative max-w-5xl mx-auto">
                        <Card className="backdrop-blur-3xl bg-gradient-to-br from-white/40 to-white/20 border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                            <CardContent className="p-0">
                                <div className="bg-gradient-to-br from-slate-50/90 to-purple-50/90 backdrop-blur-sm p-6">
                                    {/* Dashboard Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-rose-600 rounded-lg flex items-center justify-center shadow-lg">
                                                <BarChart3 className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Dashboard
                                            </h3>
                                        </div>
                                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 font-semibold backdrop-blur-sm">
                                            +$2,340 this month
                                        </Badge>
                                    </div>

                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 rounded-lg p-4 border border-white/60 shadow-lg">
                                            <p className="text-sm text-gray-700 font-medium mb-1">
                                                Total Balance
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                $12,847.32
                                            </p>
                                            <p className="text-xs text-green-700 font-medium">
                                                +12.5% from last month
                                            </p>
                                        </div>
                                        <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 rounded-lg p-4 border border-white/60 shadow-lg">
                                            <p className="text-sm text-gray-700 font-medium mb-1">
                                                Monthly Spending
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                $3,247.18
                                            </p>
                                            <p className="text-xs text-red-700 font-medium">
                                                +5.2% from last month
                                            </p>
                                        </div>
                                        <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 rounded-lg p-4 border border-white/60 shadow-lg">
                                            <p className="text-sm text-gray-700 font-medium mb-1">
                                                Savings Goal
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                78%
                                            </p>
                                            <p className="text-xs text-blue-700 font-medium">
                                                $7,800 of $10,000
                                            </p>
                                        </div>
                                    </div>

                                    {/* Chart Area */}
                                    <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 rounded-lg p-4 border border-white/60 mb-4 shadow-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-bold text-gray-900">
                                                Spending Trends
                                            </h4>
                                            <Badge
                                                variant="outline"
                                                className="text-xs font-medium text-gray-800 border-gray-300 backdrop-blur-sm"
                                            >
                                                Last 6 months
                                            </Badge>
                                        </div>
                                        <div className="h-32 bg-gradient-to-r from-purple-100/80 to-rose-100/80 rounded flex items-end justify-around p-2 backdrop-blur-sm">
                                            <div
                                                className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t shadow-lg"
                                                style={{ height: "60%" }}
                                            ></div>
                                            <div
                                                className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t shadow-lg"
                                                style={{ height: "80%" }}
                                            ></div>
                                            <div
                                                className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t shadow-lg"
                                                style={{ height: "45%" }}
                                            ></div>
                                            <div
                                                className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t shadow-lg"
                                                style={{ height: "90%" }}
                                            ></div>
                                            <div
                                                className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t shadow-lg"
                                                style={{ height: "70%" }}
                                            ></div>
                                            <div
                                                className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t shadow-lg"
                                                style={{ height: "85%" }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Recent Transactions */}
                                    <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 rounded-lg p-4 border border-white/60 shadow-lg">
                                        <h4 className="font-bold text-gray-900 mb-3">
                                            Recent Transactions
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            Salary Deposit
                                                        </p>
                                                        <p className="text-xs text-gray-700 font-medium">
                                                            Dec 1, 2024
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold text-green-700">
                                                    +$4,200.00
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                        <span className="text-xs text-red-600">
                                                            🛒
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            Grocery Store
                                                        </p>
                                                        <p className="text-xs text-gray-700 font-medium">
                                                            Nov 30, 2024
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold text-red-700">
                                                    -$127.45
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-xs text-blue-600">
                                                            ⚡
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            Electric Bill
                                                        </p>
                                                        <p className="text-xs text-gray-700 font-medium">
                                                            Nov 29, 2024
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold text-red-700">
                                                    -$89.32
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-8 px-3 sm:px-4 lg:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
                            Why Finz?
                        </h2>
                        <p className="text-xl text-slate-800 font-bold max-w-2xl mx-auto">
                            Everything you need to take control of your
                            financial future, beautifully designed and
                            incredibly simple to use.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Zap,
                                title: "Track Transactions Effortlessly",
                                description:
                                    "Automatically categorize and track all your expenses with smart AI-powered insights.",
                            },
                            {
                                icon: BarChart3,
                                title: "Visual Insights with Charts",
                                description:
                                    "Beautiful, interactive charts that make your financial data easy to understand.",
                            },
                            {
                                icon: Shield,
                                title: "Secure & Private",
                                description:
                                    "Bank-level security with end-to-end encryption. Your data stays private, always.",
                            },
                            {
                                icon: TrendingUp,
                                title: "Built for Simplicity",
                                description:
                                    "Clean, intuitive interface designed to make financial management actually enjoyable.",
                            },
                        ].map((feature, index) => (
                            <Card
                                key={index}
                                className="backdrop-blur-3xl bg-gradient-to-br from-white/40 to-white/20 border-white/60 hover:bg-gradient-to-br hover:from-white/60 hover:to-white/40 transition-all duration-300 group hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 text-gray-900">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-800 font-medium text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Preview Section */}
            <section className="py-8 px-3 sm:px-4 lg:px-6">
                <div className="max-w-6xl mx-auto">
                    <Card className="backdrop-blur-3xl bg-gradient-to-br from-white/40 to-white/20 border-white/60 shadow-2xl overflow-hidden">
                        <CardContent className="p-6 lg:p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
                                    Your financial health, visualized — the way
                                    it should be.
                                </h2>
                                <p className="text-slate-800 font-bold text-lg">
                                    See how Finz transforms complex financial
                                    data into clear, actionable insights.
                                </p>
                            </div>
                            <div className="aspect-video bg-gradient-to-br from-slate-50/90 to-purple-50/90 backdrop-blur-sm rounded-xl p-6 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Analytics Overview
                                    </h3>
                                    <div className="flex space-x-2">
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-medium text-gray-800 border-gray-300 backdrop-blur-sm"
                                        >
                                            This Month
                                        </Badge>
                                        <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-xs font-semibold backdrop-blur-sm">
                                            Live Data
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 rounded-lg p-3 border border-white/60 shadow-lg">
                                        <p className="text-xs text-gray-800 font-semibold mb-1">
                                            Income vs Expenses
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                                                    style={{ width: "68%" }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-800">
                                                68%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 rounded-lg p-3 border border-white/60 shadow-lg">
                                        <p className="text-xs text-gray-800 font-semibold mb-1">
                                            Budget Remaining
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-purple-600 to-rose-600 h-2 rounded-full"
                                                    style={{ width: "42%" }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-800">
                                                42%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 rounded-lg p-4 border border-white/60 shadow-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-bold text-gray-900">
                                            Category Breakdown
                                        </p>
                                        <Eye className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 h-16">
                                        <div className="bg-gradient-to-t from-purple-600 to-purple-400 rounded flex items-end justify-center pb-1 shadow-sm">
                                            <span className="text-xs text-white font-bold">
                                                Food
                                            </span>
                                        </div>
                                        <div
                                            className="bg-gradient-to-t from-rose-600 to-rose-400 rounded flex items-end justify-center pb-1 shadow-sm"
                                            style={{ height: "70%" }}
                                        >
                                            <span className="text-xs text-white font-bold">
                                                Transport
                                            </span>
                                        </div>
                                        <div
                                            className="bg-gradient-to-t from-indigo-600 to-indigo-400 rounded flex items-end justify-center pb-1 shadow-sm"
                                            style={{ height: "85%" }}
                                        >
                                            <span className="text-xs text-white font-bold">
                                                Bills
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-8 px-3 sm:px-4 lg:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
                            Loved by thousands
                        </h2>
                        <p className="text-slate-800 font-bold text-lg">
                            See what our users are saying about their Finz
                            experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Sarah Chen",
                                role: "Freelance Designer",
                                avatar: "SC",
                                quote: "Finz completely changed how I think about money. The visualizations make everything so clear!",
                            },
                            {
                                name: "Marcus Johnson",
                                role: "Software Engineer",
                                avatar: "MJ",
                                quote: "Finally, a finance app that doesn't feel overwhelming. Clean, simple, and incredibly powerful.",
                            },
                            {
                                name: "Emily Rodriguez",
                                role: "Small Business Owner",
                                avatar: "ER",
                                quote: "The insights I get from Finz have helped me save over $2,000 this year. Absolutely love it!",
                            },
                        ].map((testimonial, index) => (
                            <Card
                                key={index}
                                className="backdrop-blur-3xl bg-gradient-to-br from-white/40 to-white/20 border-white/60 hover:bg-gradient-to-br hover:from-white/60 hover:to-white/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 shadow-lg">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-gray-700 font-medium text-sm">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-4 h-4 text-yellow-400 fill-current"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-800 font-medium italic">
                                        &quot;{testimonial.quote}&quot;
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-8 px-3 sm:px-4 lg:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <Card className="backdrop-blur-3xl bg-gradient-to-br from-white/40 to-white/20 border-white/60 shadow-2xl">
                        <CardContent className="p-6 lg:p-10">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-6 p-2 bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
                                Ready to get clarity on your spending?
                            </h2>
                            <p className="text-xl text-slate-800 font-bold mb-8">
                                Takes less than 60 seconds to set up.
                            </p>
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-3 font-semibold"
                                onClick={handleDirectNavigation}
                            >
                                Get Started Free
                            </Button>
                            <p className="text-gray-600 font-medium text-sm mt-4">
                                No credit card required • Free forever plan
                                available
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-3 sm:px-4 lg:px-6 backdrop-blur-3xl bg-gradient-to-br from-white/30 to-white/10 border-t border-white/50 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-rose-600 rounded-lg flex items-center justify-center shadow-lg">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
                                Finz
                            </span>
                        </div>
                        <div className="flex items-center space-x-6 text-slate-800 font-bold">
                            <Link
                                href="#privacy"
                                className="hover:text-purple-700 transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="#contact"
                                className="hover:text-purple-700 transition-colors"
                            >
                                Contact
                            </Link>
                            <Link
                                href="#github"
                                className="hover:text-purple-700 transition-colors"
                            >
                                GitHub
                            </Link>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/30 text-center text-gray-600 font-medium">
                        <p>
                            &copy; 2024 Finz. All rights reserved. Made with ❤️
                            for better financial futures.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
