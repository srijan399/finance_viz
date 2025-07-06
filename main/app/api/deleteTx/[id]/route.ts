import Tx from "@/app/_models/schema";
import connectToDatabase from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

const deleteHandler = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectToDatabase();

        console.log("Params:", params, request);
        const { id } = await params;
        console.log("Deleting transaction with ID:", id);

        if (!id) {
            return NextResponse.json(
                { message: "Missing transaction ID" },
                { status: 400 }
            );
        }

        const deletedTx = await Tx.findByIdAndDelete(id);

        if (!deletedTx) {
            return NextResponse.json(
                { message: "Transaction not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Transaction deleted successfully",
                deletedTx: deletedTx,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
};

export { deleteHandler as DELETE };
