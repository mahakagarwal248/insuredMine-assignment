import mongoose from "mongoose";

const policyCategorySchema = new mongoose.Schema(
  {
    categoryName: { type: String },
  },
  { timestamps: true }
);

const PolicyCategoryModel = mongoose.model(
  "PolicyCategory",
  policyCategorySchema
);
export default PolicyCategoryModel;
