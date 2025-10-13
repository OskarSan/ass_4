import mongoose from "mongoose";
const momSchema = new mongoose.Schema({
	name: { type: String, required: true },
	age: { type: Number, required: true },
	email: { type: String, required: true },
});
const Mom = mongoose.model("Mom", momSchema);
export default Mom;
