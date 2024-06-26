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
    firebaseToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//let Users
// = mongoose.models.UsersCollection || mongoose.model("usersCollection", usersSchema);

const Users = mongoose.models.UsersCollection
  ? mongoose.model("UsersCollection")
  : mongoose.model("UsersCollection", usersSchema);

export default Users;
