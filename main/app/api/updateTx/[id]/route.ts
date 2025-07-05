import connectToDatabase from "@/lib/connect";
import Tx from "@/app/_models/schema";
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
        const updatedTx = await Tx.findByIdAndUpdate(id, body, {
            new: true,
        });

        if (!updatedTx) {
            return new Response("Transaction not found", { status: 404 });
        }

        return new NextResponse(
            JSON.stringify({
                message: "Transaction updated successfully",
                updatedTx,
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
