import connectToDatabase from "@/lib/connect";
import { NextResponse } from "next/server";
import Tx from "@/app/_models/schema";

const getHandler = async (req: Request) => {
    try {
        await connectToDatabase();
        console.log(req);

        const transactions = await Tx.find({}).sort({ date: -1 }); // Sort by date in descending order (newest first)

        return NextResponse.json({
            transactions: transactions,
            message: "Transactions retrieved successfully",
            count: transactions.length,
            ok: true,
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
};

export { getHandler as GET };
