import connectToDatabase from "@/lib/connect";
import Tx from "@/app/_models/schema";
import { NextRequest as Request } from "next/server";
import { NextResponse as Response } from "next/server";

const postHandler = async (req: Request) => {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { amount, date, description, category } = body;

        if (!amount || !date || !description || !category) {
            return new Response("Missing required fields", { status: 400 });
        }

        const newTx = new Tx({
            amount,
            date: new Date(date),
            description,
            category,
        });

        await newTx.save();

        return new Response(
            JSON.stringify({
                newTx: newTx,
                message: "Transaction added successfully",
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
