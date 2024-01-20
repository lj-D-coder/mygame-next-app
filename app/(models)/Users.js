
import mongoose, { Schema, mongo } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise

const usersSchema = mongoose.Schema(
    {
        loginId:{
            type: String,
            unique: true,
        },
        userName: {
            type: String
        },
        phoneNo: {
            type: String
        },
        email:{
            type: String
        },
        userRole:{
            type: String
        },
        profilePicture:{
            type: String
        }
    },
        {
            timestamps: true,
    },
    {
        versionKey: false
    }
);

const Users = mongoose.models.Users || mongoose.model('usersCollection', usersSchema);

export default Users;