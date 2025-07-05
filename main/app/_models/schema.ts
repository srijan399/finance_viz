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

export default Tx;
