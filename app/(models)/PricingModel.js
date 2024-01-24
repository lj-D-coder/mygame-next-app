import mongoose, { Schema } from "mongoose";

const couponSchema = new mongoose.Schema({
  code: String,
  value: String,
  expiry: String,
});

const priceSchema = new mongoose.Schema({
  type: String,
  Price: String,
  discount: String,
  coupon: {
    allow: Boolean,
    showCoupon: Boolean,
    validCoupon: [couponSchema],
  },
});

const businessPricingSchema = new mongoose.Schema(
  {
    businessID: String,
    price: {
      individual: priceSchema,
      team: priceSchema,
      field: priceSchema,
    },
  },
  {
    timestamps: true,
  }
);

const PricingModel = mongoose.model("pricingCollection", businessPricingSchema);

export default PricingModel;
