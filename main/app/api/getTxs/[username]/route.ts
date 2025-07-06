import connectToDatabase from "@/lib/connect";
import { NextRequest as Request, NextResponse } from "next/server";
import { User } from "@/app/_models/schema";

const getHandler = async (
    req: Request,
    { params }: { params: Promise<{ username: string }> }
) => {
    try {
        await connectToDatabase();

        const { username } = await params;
        console.log("Fetching transactions for user:", username);

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

        const sortedTransactions = user.transactions.sort(
            (a: any, b: any) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return NextResponse.json({
            transactions: sortedTransactions,
            message: "Transactions retrieved successfully",
            count: sortedTransactions.length,
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
