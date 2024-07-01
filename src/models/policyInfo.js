import mongoose from "mongoose";

const policyInfoSchema = new mongoose.Schema(
  {
    policyNumber: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    policyCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PolicyCategory",
    },
    policyCarrier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PolicyCarrier",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const PolicyInfoModel = mongoose.model("PolicyInfo", policyInfoSchema);
export default PolicyInfoModel;
