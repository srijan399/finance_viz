import AddForm from "@/components/ui/addForm";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Transaction {
    _id: string;
    amount: number;
    date: Date;
    description: string;
    category: "daily expenses" | "miscellaneous" | "groceries & food" | "bills";
    __v: number;
}

const handleUpdateTransaction = async (id: string, onSuccess: () => void) => {
    console.log("Update transaction:", id);
    const response = await fetch(`/api/updateTx/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        console.log("Transaction updated successfully");
        onSuccess(); // Trigger refresh
    }
};

const handleDeleteTransaction = async (id: string, onSuccess: () => void) => {
    console.log("Delete transaction:", id);
    const response = await fetch(`/api/deleteTx/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
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
    setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>
) => (
    <div className="flex-1 overflow-auto">
        <div className="p-4 lg:p-6 pb-8">
            <div className="mb-6">
                <AddForm refresh={refreshFlag} setRefresh={setRefreshFlag} />
            </div>

            {/* Transactions Table */}
            <Card className="shadow-sm">
                <CardContent className="p-0">
                    {/* Mobile Card Layout */}
                    <div className="block md:hidden">
                        <div className="p-4 space-y-4">
                            {transactions.map((transaction) => {
                                const categoryInfo =
                                    categoryIcons[transaction.category];
                                const status = getStatusBadge(
                                    transaction.amount
                                );

                                return (
                                    <div
                                        key={transaction._id}
                                        className="bg-white border rounded-lg p-4 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-10 h-10 rounded-full ${categoryInfo.bg} flex items-center justify-center text-lg`}
                                                >
                                                    {categoryInfo.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900 text-sm">
                                                        {
                                                            transaction.description
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-500 capitalize">
                                                        {transaction.category}
                                                    </div>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
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
                                                        onClick={() =>
                                                            handleUpdateTransaction(
                                                                transaction._id,
                                                                () =>
                                                                    setRefreshFlag(
                                                                        !refreshFlag
                                                                    )
                                                            )
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Update
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDeleteTransaction(
                                                                transaction._id,
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
                                                {formatDate(transaction.date)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={status.variant}
                                                    className="text-xs"
                                                >
                                                    {status.label}
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
                            })}
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
                                {transactions.map((transaction) => {
                                    const categoryInfo =
                                        categoryIcons[transaction.category];
                                    const status = getStatusBadge(
                                        transaction.amount
                                    );

                                    return (
                                        <tr
                                            key={transaction._id}
                                            className="border-b hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-10 h-10 rounded-full ${categoryInfo.bg} flex items-center justify-center text-lg`}
                                                    >
                                                        {categoryInfo.icon}
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
                                                    {transaction.category}
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
                                                <Badge variant={status.variant}>
                                                    {status.label}
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
                                                                Open menu
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleUpdateTransaction(
                                                                    transaction._id,
                                                                    () =>
                                                                        setRefreshFlag(
                                                                            !refreshFlag
                                                                        )
                                                                )
                                                            }
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Update
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleDeleteTransaction(
                                                                    transaction._id,
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
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);

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
