const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: { type: String, trim: true },
    lastLoggedInDate: { type: Date, default: null },
    backgroundColor: { type: String, default: "#ffffff" },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

//hash & save user's password
userSchema.pre("save", async function (next) {
  const user = this;
  if (this.isModified("password") || this.isNew) {
    try {
      user.password = await bcrypt.hash(user.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  return next();
});

userSchema.methods.comparePassword = async function (pw) {
  try {
    const isMatch = await bcrypt.compare(pw, this.password);
    if (!isMatch) throw new Error("Invalid username or password");
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
