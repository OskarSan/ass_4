import mongoose from "mongoose";

const dawgSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    globalId: { type: String, required: true }
});
const Dawg = mongoose.model("Dawg", dawgSchema);

export default Dawg;
