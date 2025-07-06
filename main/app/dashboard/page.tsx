"use client";

import { useEffect, useState } from "react";
import {
    Home,
    Wallet,
    Activity,
    Receipt,
    BarChart3,
    Settings,
    X,
} from "lucide-react";
import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import AddForm from "@/components/ui/addForm";
import Header from "@/components/ui/header";
import { renderTransactionsContent } from "@/lib/renderTransactionsContent";
import { useUserContext } from "../context/userContext";
// import { categoryIcons, getStatusBadge } from "@/lib/renderTransactionsContent";

interface Transaction {
    _id: string;
    amount: number;
    date: Date;
    description: string;
    category: "daily expenses" | "miscellaneous" | "groceries & food" | "bills";
    __v: number;
}

const sidebarItems = [
    { icon: Home, label: "Dashboard", active: false, id: "dashboard" },
    { icon: Activity, label: "Activity", active: false, id: "activity" },
    { icon: Receipt, label: "Transactions", active: true, id: "transactions" },
    { icon: BarChart3, label: "Analytics", active: false, id: "analytics" },
    { icon: Settings, label: "Settings", active: false, id: "settings" },
];

const chartConfig = {
    amount: {
        label: "Amount",
        color: "hsl(var(--chart-1))",
    },
};

const Dashboard = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [refreshFlag, setRefreshFlag] = useState(false);

    const { username, isLoading } = useUserContext();

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!username) return;

            try {
                setLoading(true);
                const res = await fetch(`/api/getTxs/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) {
                    console.error("Failed to fetch transactions");
                    return;
                }
                const data = await res.json();
                setTransactions(data.transactions);
                setHasLoadedOnce(true);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [username, refreshFlag]);

    const monthlyData = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date); // Convert string to Date object
        const monthYear = date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
        if (!acc[monthYear]) {
            acc[monthYear] = 0;
        }
        acc[monthYear] += transaction.amount;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(monthlyData)
        .map(([month, amount]) => ({
            month,
            amount,
        }))
        .sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
        );

    // Process data for category pie chart
    const categoryData = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
            acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryData).map(([category, amount]) => ({
        name: category,
        value: amount,
        color: getCategoryColor(category),
    }));

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // const formatDate = (date: string | Date) => {
    //     const dateObj = typeof date === "string" ? new Date(date) : date;
    //     return dateObj.toLocaleDateString("en-US", {
    //         month: "short",
    //         day: "numeric",
    //         year: "numeric",
    //     });
    // };

    function getCategoryColor(category: string) {
        const colors = {
            "daily expenses": "#3b82f6",
            miscellaneous: "#6b7280",
            "groceries & food": "#10b981",
            bills: "#f59e0b",
        };
        return colors[category as keyof typeof colors] || "#6b7280";
    }

    const renderDashboardContent = () => (
        <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Monthly Expenses Chart */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg lg:text-xl">
                                    Monthly Expenses
                                </CardTitle>
                                <CardDescription>
                                    Your spending trends over time
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-[250px] lg:h-[300px]"
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={chartData}
                                            margin={{
                                                top: 20,
                                                right: 10,
                                                left: 10,
                                                bottom: 5,
                                            }}
                                        >
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 10 }}
                                                tickFormatter={(value) =>
                                                    value.split(" ")[0]
                                                }
                                            />
                                            <YAxis
                                                tick={{ fontSize: 10 }}
                                                tickFormatter={(value) =>
                                                    `₹${(value / 1000).toFixed(
                                                        0
                                                    )}k`
                                                }
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent
                                                        formatter={(value) => [
                                                            formatCurrency(
                                                                value as number
                                                            ),
                                                            "Total Expenses",
                                                        ]}
                                                        labelFormatter={(
                                                            label
                                                        ) => `Month: ${label}`}
                                                    />
                                                }
                                            />
                                            <Bar
                                                dataKey="amount"
                                                fill="#8b5cf6"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Category Breakdown */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg lg:text-xl">
                                Category Breakdown
                            </CardTitle>
                            <CardDescription>
                                Expenses by category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={chartConfig}
                                className="h-[250px] lg:h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <ChartTooltip
                                            content={({ active, payload }) => {
                                                if (
                                                    active &&
                                                    payload &&
                                                    payload.length
                                                ) {
                                                    const data =
                                                        payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                                                            <p className="font-medium">
                                                                {data.name}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {formatCurrency(
                                                                    data.value
                                                                )}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>

                            {/* Legend */}
                            <div className="mt-4 space-y-2">
                                {pieData.map((entry, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        entry.color,
                                                }}
                                            />
                                            <span className="text-xs lg:text-sm font-medium capitalize">
                                                {entry.name}
                                            </span>
                                        </div>
                                        <span className="text-xs lg:text-sm text-gray-600">
                                            {formatCurrency(entry.value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Expenses
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(
                                            transactions.reduce(
                                                (acc, t) => acc + t.amount,
                                                0
                                            )
                                        )}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <Receipt className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Transactions
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {transactions.length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Average Transaction
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(
                                            transactions.length > 0
                                                ? transactions.reduce(
                                                      (acc, t) =>
                                                          acc + t.amount,
                                                      0
                                                  ) / transactions.length
                                                : 0
                                        )}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center flex-1">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Loading Transactions
                            </h3>
                            <p className="text-gray-500">
                                Please wait while we fetch your financial
                                data...
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (hasLoadedOnce && transactions.length === 0) {
            return (
                <div className="flex items-center justify-center flex-1 p-4">
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Receipt className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Transactions Found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            You haven&apos;t added any transactions yet. Start
                            by adding your first transaction!
                        </p>
                        <AddForm
                            refresh={refreshFlag}
                            setRefresh={setRefreshFlag}
                        />
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case "dashboard":
                return renderDashboardContent();
            case "transactions":
                return renderTransactionsContent(
                    transactions,
                    refreshFlag,
                    setRefreshFlag,
                    username
                );
            case "activity":
                return (
                    <div className="flex items-center justify-center flex-1 p-4">
                        <div className="text-center">
                            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Activity
                            </h3>
                            <p className="text-gray-500">
                                Activity tracking coming soon...
                            </p>
                        </div>
                    </div>
                );
            case "analytics":
                return (
                    <div className="flex items-center justify-center flex-1 p-4">
                        <div className="text-center">
                            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Analytics
                            </h3>
                            <p className="text-gray-500">
                                Advanced analytics coming soon...
                            </p>
                        </div>
                    </div>
                );
            case "settings":
                return (
                    <div className="flex items-center justify-center flex-1 p-4">
                        <div className="text-center">
                            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Settings
                            </h3>
                            <p className="text-gray-500">
                                Settings panel coming soon...
                            </p>
                        </div>
                    </div>
                );
            default:
                return renderTransactionsContent(
                    transactions,
                    refreshFlag,
                    setRefreshFlag,
                    username
                );
        }
    };

    return (
        <>
            {!isLoading ? (
                <div className="flex h-screen bg-gray-50">
                    {/* Mobile Sidebar Overlay */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* Sidebar */}
                    <div
                        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-100 to-purple-200 p-6 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                            sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                    >
                        {/* Close button for mobile */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 right-4 lg:hidden text-gray-600 hover:text-gray-900"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg text-gray-800">
                                FinanceTracker
                            </span>
                        </div>

                        <nav className="space-y-2">
                            {sidebarItems.map((item, index) => (
                                <button
                                    key={index}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                                        activeTab === item.id
                                            ? "bg-purple-600 text-white shadow-lg"
                                            : "text-gray-700 hover:bg-purple-50"
                                    }`}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Header */}
                        <Header
                            activeTab={activeTab}
                            setSidebarOpen={setSidebarOpen}
                            onSearch={(query) => console.log("Search:", query)}
                            onFilter={() => console.log("Filter clicked")}
                            onExport={() => console.log("Export clicked")}
                        />

                        {/* Content */}
                        {renderContent()}
                    </div>
                </div>
            ) : (
                <div className="w-full h-screen flex items-center justify-center text-3xl text-gray-500">
                    Loading...
                </div>
            )}
        </>
    );
};

export default Dashboard;
