import mongoose, { Schema } from "mongoose";

const usersSchema = mongoose.Schema(
  {
    loginId: {
      type: String,
      unique: true,
    },
    userName: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    email: {
      type: String,
    },
    userRole: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.models.UsersCollection || mongoose.model("usersCollection", usersSchema);

export default Users;
