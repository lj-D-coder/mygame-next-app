import mongoose, { Schema } from "mongoose";

const FollowSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UsersCollection",
    },
  ],
});

const FollowModel = mongoose.models.FollowerCollection
  ? mongoose.models.FollowerCollection
  : mongoose.model("FollowerCollection", FollowSchema);

export default FollowModel;
