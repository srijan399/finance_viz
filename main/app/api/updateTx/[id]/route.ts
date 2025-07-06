import connectToDatabase from "@/lib/connect";
import { User } from "@/app/_models/schema";
import { NextRequest, NextResponse } from "next/server";

const updateHandler = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectToDatabase();

        const { id } = await params;

        if (!id) {
            return new Response("Missing transaction ID", { status: 400 });
        }

        const body = await request.json();
        const { username, amount, date, description, category } = body;

        if (!username) {
            return new Response("Username is required", { status: 400 });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        const transactionIndex = user.transactions.findIndex(
            (tx: any) => tx._id.toString() === id
        );

        if (transactionIndex === -1) {
            return new Response("Transaction not found", { status: 404 });
        }

        // Update the transaction fields
        if (amount !== undefined)
            user.transactions[transactionIndex].amount = amount;
        if (date !== undefined)
            user.transactions[transactionIndex].date = new Date(date);
        if (description !== undefined)
            user.transactions[transactionIndex].description = description;
        if (category !== undefined)
            user.transactions[transactionIndex].category = category;

        await user.save();

        return new NextResponse(
            JSON.stringify({
                message: "Transaction updated successfully",
                updatedTx: user.transactions[transactionIndex],
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error updating transaction:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};

export { updateHandler as PUT };
