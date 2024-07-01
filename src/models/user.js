import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const userSchema = new mongoose.Schema(
  {
    guid: {
      type: String,
      default: function () {
        return uuid();
      },
    },
    name: { type: String },
    dob: { type: Date },
    address: { type: String },
    phoneNumber: { type: String },
    state: { type: String },
    zipCode: { type: String },
    email: { type: String },
    gender: { type: String },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
