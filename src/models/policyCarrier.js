import mongoose from "mongoose";

const policyCarrierSchema = new mongoose.Schema(
  {
    companyName: { type: String },
  },
  { timestamps: true }
);

const PolicyCarrierModel = mongoose.model("PolicyCarrier", policyCarrierSchema);
export default PolicyCarrierModel;
