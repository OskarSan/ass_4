import mongoose from "mongoose";
const dadSchema = new mongoose.Schema({
	name: { type: String, required: true },
	age: { type: Number, required: true },
	email: { type: String, required: true },
});
const Dad = mongoose.model("Dad", dadSchema);
export default Dad;
 