import mongoose from "mongoose";
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

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
      invidual: priceSchema,
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
