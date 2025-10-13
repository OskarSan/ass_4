import mongoose from "mongoose";
const brotherSchema = new mongoose.Schema({
	name: { type: String, required: true },
	age: { type: Number, required: true },
	email: { type: String, required: true },
});
const Brother = mongoose.model("Brother", brotherSchema);
export default Brother;
