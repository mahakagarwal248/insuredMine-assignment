import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: { type: String },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;
