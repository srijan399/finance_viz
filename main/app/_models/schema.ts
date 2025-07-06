import mongoose from "mongoose";

const txSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
});

const Tx = mongoose.models.Tx || mongoose.model("Tx", txSchema);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    transactions: [txSchema],
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);

export default Tx;
