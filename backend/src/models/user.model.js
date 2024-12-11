import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  fullName: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
    minlength: 6,
  },
  profilePic: {
    type: "string",
    default:"",
  },
},
{timestamps: true}
);

const User=mongoose.model("User",userSchema);
export default User;