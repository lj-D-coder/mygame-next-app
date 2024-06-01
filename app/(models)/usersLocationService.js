import mongoose, { Schema } from "mongoose";

const UsersLocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
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

const UsersLocationModel = mongoose.models.UsersLocation ? mongoose.models.UsersLocation : mongoose.model("UsersLocation", UsersLocationSchema);

export default UsersLocationModel;
