import mongoose, { Schema } from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    businessID: { type: String, unique: true },
    businessStatus: {
      open: { type: Boolean, default: true },
      blocked: { type: Boolean, default: false },
      setupComplete: { type: Boolean, default: false },
      holiday: {
        sunday: { type: Boolean, default: false },
        monday: { type: Boolean, default: false },
        tuesday: { type: Boolean, default: false },
        wednesday: { type: Boolean, default: false },
        thursday: { type: Boolean, default: false },
        friday: { type: Boolean, default: false },
        saturday: { type: Boolean, default: false },
      },
    },
    businessInfo: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phoneNo: { type: Number, required: true },
      email: { type: String, required: true },
      facebook: { type: String, default: "https://www.facebook.com/" },
      instagram: { type: String, default: "https://www.instagram.com/" },
      bannerUrl: { type: [String], default: [] },
      gstNo: { type: String },
      location: {
        latitude: { type: String, required: true },
        longitude: { type: String, required: true },
      },
    },
    businessHours: {
      openTime: { type: String, required: true },
      closeTime: { type: String, required: true },
      breakStart: { type: String },
      breakEnd: { type: String },
    },

    slot: {
      gameLength: { type: Number, required: true },
      playerPerSide: { type: Number, default: 7 },
      customGameLength: { type: Boolean, default: true },
    },
    bookingType: {
      single: { type: Boolean, default: true },
      multiple: { type: Boolean, default: true },
      team: { type: Boolean, default: true },
      TimeRanges: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

const BusinessSetup = mongoose.models.BusinessConfig
  ? mongoose.models.BusinessConfig
  : mongoose.model("BusinessConfig", businessSchema);

export default BusinessSetup;
