import mongoose from "mongoose";
const sisterSchema = new mongoose.Schema({
	name: { type: String, required: true },
	age: { type: Number, required: true },
	email: { type: String, required: true },
});
const Sister = mongoose.model("Sister", sisterSchema);
export default Sister;
