import mongoose, { Schema } from "mongoose";

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessID: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const LocationModel = mongoose.models.Location ? mongoose.models.Location : mongoose.model("Location", LocationSchema);

export default LocationModel;
