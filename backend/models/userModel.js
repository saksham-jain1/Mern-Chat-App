const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")


const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://res-console.cloudinary.com/chatting-app/thumbnails/v1/image/upload/v1656133614/c2FtcGxlcy9wZW9wbGUvc21pbGluZy1tYW4=/preview",
    },
  },
  {
    timestamps: true,
  }
);

userModel.methods.matchPassoword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userModel.pre('save', async function (next) {
  if(!this.isModified)
  {
    next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userModel);

module.exports = User;
