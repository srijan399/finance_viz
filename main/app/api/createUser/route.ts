import { User } from "@/app/_models/schema";
import connectToDatabase from "@/lib/connect";

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const { username } = await req.json();

        if (!username) {
            return new Response("Username is required", { status: 400 });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return new Response(
                JSON.stringify({
                    ...existingUser.toObject(),
                    ok: true,
                    message: "User already exists & logged in",
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        const newUser = new User({ username });
        await newUser.save();

        console.log("New user created:", newUser);

        return new Response(
            JSON.stringify({ ...newUser.toObject(), ok: true }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
