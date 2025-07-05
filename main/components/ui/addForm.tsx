"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AddFormProps {
    refresh: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define categories with their display names and lowercase values
const categories = [
    { value: "daily expenses", label: "Daily Expenses", icon: "🚗" },
    { value: "miscellaneous", label: "Miscellaneous", icon: "📦" },
    { value: "groceries & food", label: "Groceries & Food", icon: "🛒" },
    { value: "bills", label: "Bills", icon: "⚡" },
];

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

const formSchema = z.object({
    amount: z.number().min(0, "Amount must be a positive number"),
    date: z.date({
        required_error: "A date is required",
    }),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
});

const AddForm = ({ refresh, setRefresh }: AddFormProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
            date: new Date(),
            description: "",
            category: "",
        },
    });

    const {
        register,
        handleSubmit: formFunctionSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = form;

    const selectedDate = watch("date");

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/addTx", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: data.amount,
                    date: data.date.toISOString(),
                    description: data.description,
                    category: data.category.toLowerCase(), // Ensure lowercase
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add transaction");
            }

            const result = await response.json();
            console.log("Transaction added:", result);
            setSuccess(true);
            reset();
            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
                setRefresh(!refresh);
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        // <div className="flex flex-col items-center justify-center h-screen">
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="mb-6">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new transaction.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                        <p className="text-sm text-green-600">
                            Transaction added successfully!
                        </p>
                    </div>
                )}

                <form
                    onSubmit={formFunctionSubmit(handleSubmit)}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            {...register("amount", { valueAsNumber: true })}
                            className={errors.amount ? "border-red-500" : ""}
                            disabled={loading}
                        />
                        {errors.amount && (
                            <p className="text-sm text-red-600">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !selectedDate &&
                                            "text-muted-foreground",
                                        errors.date && "border-red-500"
                                    )}
                                    disabled={loading}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate
                                        ? format(selectedDate, "PPP")
                                        : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) =>
                                        date && setValue("date", date)
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.date && (
                            <p className="text-sm text-red-600">
                                {errors.date.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            type="text"
                            {...register("description")}
                            className={
                                errors.description ? "border-red-500" : ""
                            }
                            disabled={loading}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            {...register("category")}
                            className={cn(
                                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                errors.category ? "border-red-500" : ""
                            )}
                            disabled={loading}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option
                                    key={category.value}
                                    value={category.value}
                                >
                                    {category.icon} {category.label}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="text-sm text-red-600">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? "Adding..." : "Add Transaction"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        // </div>
    );
};

export default AddForm;
