import AddForm from "@/components/ui/addForm";
import UpdateForm from "@/components/ui/updateForm";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { useUserContext } from "@/app/context/userContext";

interface Transaction {
    _id: string;
    amount: number;
    date: Date;
    description: string;
    category: "daily expenses" | "miscellaneous" | "groceries & food" | "bills";
    __v: number;
}

const handleDeleteTransaction = async (
    id: string,
    username: string,
    onSuccess: () => void
) => {
    console.log("Delete transaction:", id);
    const response = await fetch(`/api/deleteTx/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            transactionId: id,
        }),
    });

    if (response.ok) {
        console.log("Transaction deleted successfully");
        onSuccess();
    }
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const renderTransactionsContent = (
    transactions: Transaction[],
    refreshFlag: boolean,
    setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>,
    username: string,
    selectedCategory: string = "all",
    onCategoryChange: (category: string) => void = () => {}
) => {
    // Filter transactions based on selected category
    const filteredTransactions =
        selectedCategory === "all"
            ? transactions
            : transactions.filter(
                  (transaction) => transaction.category === selectedCategory
              );

    const categories = [
        { value: "all", label: "All Categories" },
        { value: "daily expenses", label: "Daily Expenses" },
        { value: "miscellaneous", label: "Miscellaneous" },
        { value: "groceries & food", label: "Groceries & Food" },
        { value: "bills", label: "Bills" },
    ];

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6 pb-8">
                <div className="mb-6">
                    <AddForm
                        refresh={refreshFlag}
                        setRefresh={setRefreshFlag}
                    />
                </div>

                {/* Category Filter */}
                <Card className="mb-6 shadow-sm">
                    <CardContent className="px-6 py-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-semibold text-gray-900">
                                Filter by Category
                            </span>
                            {selectedCategory !== "all" && (
                                <Badge variant="outline" className="text-xs">
                                    {filteredTransactions.length} of{" "}
                                    {transactions.length} shown
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const isSelected =
                                    selectedCategory === category.value;
                                const count =
                                    category.value === "all"
                                        ? transactions.length
                                        : transactions.filter(
                                              (t) =>
                                                  t.category === category.value
                                          ).length;

                                return (
                                    <Button
                                        key={category.value}
                                        variant={
                                            isSelected ? "default" : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            onCategoryChange(category.value)
                                        }
                                        className={`text-xs transition-all duration-200 ${
                                            isSelected
                                                ? "bg-purple-700 text-white shadow-sm"
                                                : "bg-white "
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {category.value !== "all" && (
                                                <span className="text-sm">
                                                    {
                                                        categoryIcons[
                                                            category.value as keyof typeof categoryIcons
                                                        ]?.icon
                                                    }
                                                </span>
                                            )}
                                            {category.label}
                                            <Badge
                                                variant={
                                                    isSelected
                                                        ? "secondary"
                                                        : "outline"
                                                }
                                                className={`ml-1 px-1.5 py-0 text-xs font-medium ${
                                                    isSelected
                                                        ? "bg-gray-100 text-gray-800"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {count}
                                            </Badge>
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions Table */}
                <Card className="shadow-sm">
                    <CardContent className="p-0">
                        {filteredTransactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                <div className="text-gray-400 mb-4">
                                    <Filter className="h-12 w-12 mx-auto mb-2" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No transactions found
                                </h3>
                                <p className="text-gray-500 text-center max-w-md">
                                    {selectedCategory === "all"
                                        ? "No transactions available. Add your first transaction to get started."
                                        : `No transactions found in "${
                                              categories.find(
                                                  (c) =>
                                                      c.value ===
                                                      selectedCategory
                                              )?.label
                                          }" category.`}
                                </p>
                                {selectedCategory !== "all" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onCategoryChange("all")}
                                        className="mt-4"
                                    >
                                        Show All Categories
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Mobile Card Layout */}
                                <div className="block md:hidden">
                                    <div className="p-4 space-y-4">
                                        {filteredTransactions.map(
                                            (transaction) => {
                                                const categoryInfo =
                                                    categoryIcons[
                                                        transaction.category
                                                    ];
                                                const status = getStatusBadge(
                                                    transaction.amount
                                                );

                                                return (
                                                    <div
                                                        key={transaction._id}
                                                        className="bg-white border rounded-lg p-4 shadow-sm"
                                                        onClick={() =>
                                                            console.log(
                                                                "Transaction clicked:",
                                                                transaction._id
                                                            )
                                                        }
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={`w-10 h-10 rounded-full ${categoryInfo.bg} flex items-center justify-center text-lg`}
                                                                >
                                                                    {
                                                                        categoryInfo.icon
                                                                    }
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-gray-900 text-sm">
                                                                        {
                                                                            transaction.description
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 capitalize">
                                                                        {
                                                                            transaction.category
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem
                                                                        asChild
                                                                    >
                                                                        <UpdateForm
                                                                            transaction={
                                                                                transaction
                                                                            }
                                                                            username={
                                                                                username
                                                                            }
                                                                            onSuccess={() =>
                                                                                setRefreshFlag(
                                                                                    !refreshFlag
                                                                                )
                                                                            }
                                                                        />
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        variant="destructive"
                                                                        onClick={() =>
                                                                            handleDeleteTransaction(
                                                                                transaction._id,
                                                                                username,
                                                                                () =>
                                                                                    setRefreshFlag(
                                                                                        !refreshFlag
                                                                                    )
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="text-xs text-gray-500">
                                                                {formatDate(
                                                                    transaction.date
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge
                                                                    variant={
                                                                        status.variant
                                                                    }
                                                                    className="text-xs"
                                                                >
                                                                    {
                                                                        status.label
                                                                    }
                                                                </Badge>
                                                                <span className="font-semibold text-red-600 text-sm">
                                                                    -
                                                                    {formatCurrency(
                                                                        transaction.amount
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>

                                {/* Desktop Table Layout */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                                                    Name/Business
                                                </th>
                                                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                                                    Date
                                                </th>
                                                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                                                    Category
                                                </th>
                                                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                                                    Amount
                                                </th>
                                                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                                                    Status
                                                </th>
                                                <th className="text-left py-4 px-6 font-semibold text-gray-700">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTransactions.map(
                                                (transaction) => {
                                                    const categoryInfo =
                                                        categoryIcons[
                                                            transaction.category
                                                        ];
                                                    const status =
                                                        getStatusBadge(
                                                            transaction.amount
                                                        );

                                                    return (
                                                        <tr
                                                            key={
                                                                transaction._id
                                                            }
                                                            className="border-b hover:bg-gray-50 transition-colors"
                                                        >
                                                            <td className="py-4 px-6">
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className={`w-10 h-10 rounded-full ${categoryInfo.bg} flex items-center justify-center text-lg`}
                                                                    >
                                                                        {
                                                                            categoryInfo.icon
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-gray-900">
                                                                            {
                                                                                transaction.description
                                                                            }
                                                                        </div>
                                                                        <div className="text-sm text-gray-500 capitalize">
                                                                            {
                                                                                transaction.category
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <div className="text-gray-900">
                                                                    {formatDate(
                                                                        transaction.date
                                                                    )}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    At{" "}
                                                                    {new Date(
                                                                        transaction.date
                                                                    ).toLocaleTimeString(
                                                                        "en-US",
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        }
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="capitalize"
                                                                >
                                                                    {
                                                                        transaction.category
                                                                    }
                                                                </Badge>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <span className="font-semibold text-red-600">
                                                                    -
                                                                    {formatCurrency(
                                                                        transaction.amount
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <Badge
                                                                    variant={
                                                                        status.variant
                                                                    }
                                                                >
                                                                    {
                                                                        status.label
                                                                    }
                                                                </Badge>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 w-8 p-0"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                            <span className="sr-only">
                                                                                Open
                                                                                menu
                                                                            </span>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            asChild
                                                                        >
                                                                            <UpdateForm
                                                                                transaction={
                                                                                    transaction
                                                                                }
                                                                                username={
                                                                                    username
                                                                                }
                                                                                onSuccess={() =>
                                                                                    setRefreshFlag(
                                                                                        !refreshFlag
                                                                                    )
                                                                                }
                                                                            />
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            variant="destructive"
                                                                            onClick={() =>
                                                                                handleDeleteTransaction(
                                                                                    transaction._id,
                                                                                    username,
                                                                                    () =>
                                                                                        setRefreshFlag(
                                                                                            !refreshFlag
                                                                                        )
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className=" h-4 w-4" />
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export const getStatusBadge = (amount: number) => {
    if (amount > 1000)
        return { label: "High", variant: "destructive" as const };
    if (amount > 500) return { label: "Medium", variant: "secondary" as const };
    return { label: "Low", variant: "default" as const };
};

export const categoryIcons = {
    "daily expenses": { icon: "🚗", bg: "bg-blue-100", color: "text-blue-600" },
    miscellaneous: { icon: "📦", bg: "bg-gray-100", color: "text-gray-600" },
    "groceries & food": {
        icon: "🛒",
        bg: "bg-green-100",
        color: "text-green-600",
    },
    bills: { icon: "⚡", bg: "bg-yellow-100", color: "text-yellow-600" },
};
