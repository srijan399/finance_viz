import connectToDatabase from "@/lib/connect";
import { NextResponse } from "next/server";
import Tx from "@/app/_models/schema";

const deleteAll = async (req: Request) => {
    try {
        await connectToDatabase();

        const deletedTx = await Tx.deleteMany({});

        if (!deletedTx) {
            return NextResponse.json(
                { error: "Transaction not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Transactions deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return NextResponse.json(
            { error: "Failed to delete transaction" },
            { status: 500 }
        );
    }
};

export { deleteAll as DELETE };
