import mongoose, { Schema } from "mongoose";

const receiptSchema = mongoose.Schema(
  {
    receiptNo: {
      type: Number,
      default: 1,
    }
  },
  {
    timestamps: false,
  }
);

const Receipt = mongoose.models.receiptCounter ? mongoose.models.receiptCounter : mongoose.model("receiptCounter", receiptSchema);

export default Receipt;
