"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select } from "./select";
import { Card, CardContent } from "@/components/ui/card";
import { Edit } from "lucide-react";

interface Transaction {
    _id: string;
    amount: number;
    date: Date;
    description: string;
    category: "daily expenses" | "miscellaneous" | "groceries & food" | "bills";
    __v: number;
}

interface UpdateFormProps {
    transaction: Transaction;
    username: string;
    onSuccess: () => void;
}

export default function UpdateForm({
    transaction,
    username,
    onSuccess,
}: UpdateFormProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
        date: new Date(transaction.date).toISOString().split("T")[0],
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`/api/updateTx/${transaction._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    amount: Number(formData.amount),
                    description: formData.description,
                    category: formData.category,
                    date: new Date(formData.date).toISOString(),
                }),
            });

            if (response.ok) {
                console.log("Transaction updated successfully");
                setOpen(false);
                onSuccess(); // Trigger refresh
            } else {
                const error = await response.json();
                console.error("Failed to update transaction:", error);
                alert("Failed to update transaction. Please try again.");
            }
        } catch (error) {
            console.error("Error updating transaction:", error);
            alert("An error occurred while updating the transaction.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to original values
        setFormData({
            amount: transaction.amount,
            description: transaction.description,
            category: transaction.category,
            date: new Date(transaction.date).toISOString().split("T")[0],
        });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center w-full px-2 py-1.5 text-sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Update
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Transaction</DialogTitle>
                </DialogHeader>
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter transaction description"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (₹)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "amount",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    id="category"
                                    value={formData.category}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLSelectElement>
                                    ) =>
                                        handleInputChange(
                                            "category",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value="daily expenses">
                                        Daily Expenses
                                    </option>
                                    <option value="miscellaneous">
                                        Miscellaneous
                                    </option>
                                    <option value="groceries & food">
                                        Groceries & Food
                                    </option>
                                    <option value="bills">Bills</option>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "date",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading
                                        ? "Updating..."
                                        : "Update Transaction"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
