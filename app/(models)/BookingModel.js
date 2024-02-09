import mongoose, { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    discount: Number,
    amountPaid: {
      type: Number,
      required: true,
    },
    couponId: String,
    paymentId: String,
    paymentMode: String,
    paymentStatus: String,
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    businessID: {
      type: String,
      required: true,
    },
    matchId: String,
    bookingType: {
      type: String,
      required: true,
    },
    bookingStatus: String,
    bookingDate: {
      type: Date,
      required: true,
    },
    receiptNo: Number,
    paymentInfo: paymentSchema,
  },
  {
    timestamps: true,
  }
);

//const BookingModel = mongoose.model("Bookings", bookingSchema);
const BookingModel =
  mongoose.models.Bookings || mongoose.model("Bookings", bookingSchema);

export default BookingModel;
