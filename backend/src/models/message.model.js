import mongoose from "mongoose";
const meesageSchema = new mongoose.Schema({
});
const Message = mongoose.model("Message", meesageSchema);
export default Message;