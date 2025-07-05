import Tx from "@/app/_models/schema";
import connectToDatabase from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

const deleteHandler = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        await connectToDatabase();

        console.log("Params:", params);
        const id = params.id;
        console.log("Deleting transaction with ID:", id);

        if (!id) {
            return new Response("Missing transaction ID", { status: 400 });
        }

        const deletedTx = await Tx.findByIdAndDelete(id);

        if (!deletedTx) {
            return new Response("Transaction not found", { status: 404 });
        }

        return new NextResponse(
            JSON.stringify({
                message: "Transaction deleted successfully",
                deletedTx: deletedTx,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};

export { deleteHandler as DELETE };
