import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const userAccountSchema = new mongoose.Schema(
  {
    guid: {
      type: String,
      default: function () {
        return uuid();
      },
    },
    accountName: { type: String },
    accountType: { type: String },
    userId: { type: String },
  },
  { timestamps: true }
);

const UserAccountModel = mongoose.model("UserAccount", userAccountSchema);
export default UserAccountModel;
