import { User } from "@/app/_models/schema";
import connectToDatabase from "@/lib/connect";
import { NextResponse as Response, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const { username } = await req.json();
        console.log("Received username:", username);

        if (!username) {
            return Response.json(
                { message: "Username is required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return Response.json(
                {
                    ...existingUser.toObject(),
                    ok: true,
                    message: "User already exists & logged in",
                },
                { status: 200 }
            );
        }

        const newUser = new User({ username });
        await newUser.save();

        console.log("New user created:", newUser);

        return Response.json(
            {
                ...newUser.toObject(),
                ok: true,
            },
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return Response.json(
            {
                ok: false,
                message: "Error creating user",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            {
                status: 500,
            }
        );
    }
}
