import connectToDatabase from "@/lib/connect";
import { NextResponse } from "next/server";
import { User } from "@/app/_models/schema";

const deleteHandler = async (req: Request) => {
    try {
        await connectToDatabase();

        const { username, transactionId } = await req.json();

        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        if (transactionId) {
            // Delete specific transaction by ID
            const initialLength = user.transactions.length;
            user.transactions = user.transactions.filter(
                (tx: any) => tx._id.toString() !== transactionId
            );

            if (user.transactions.length === initialLength) {
                return NextResponse.json(
                    { error: "Transaction not found" },
                    { status: 404 }
                );
            }

            await user.save();

            return NextResponse.json(
                { message: "Transaction deleted successfully" },
                { status: 200 }
            );
        } else {
            // Delete all transactions for the user
            user.transactions = [];
            await user.save();

            return NextResponse.json(
                { message: "All transactions deleted successfully" },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return NextResponse.json(
            { error: "Failed to delete transaction" },
            { status: 500 }
        );
    }
};

export { deleteHandler as DELETE };
