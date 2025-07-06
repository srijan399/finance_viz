import connectToDatabase from "@/lib/connect";
import { User } from "@/app/_models/schema";
import { NextRequest as Request } from "next/server";
import { NextResponse as Response } from "next/server";

const postHandler = async (req: Request) => {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { amount, date, description, category, username } = body;

        if (!amount || !date || !description || !category || !username) {
            return new Response("Missing required fields", { status: 400 });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        const newTx = {
            amount,
            date: new Date(date),
            description,
            category,
        };

        user.transactions.push(newTx);
        await user.save();

        return new Response(
            JSON.stringify({
                newTx: newTx,
                message: "Transaction added successfully to user",
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error adding transaction:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};

export { postHandler as POST };
