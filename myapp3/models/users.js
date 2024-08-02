const mongoose = require("mongoose");

// const profileSchema = new mongoose.Schema({
//   gender: { type: String, required: true },
//   bio: { type: String },
// });

// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true, trim: true },
//   lastName: { type: String, required: true, lowercase: true, trim: true },
//   fullName: { type: String },
//   email: {
//     type: String,
//     required: true,
//     unique: [true, "email already exists"],
//     trim: true,
//   },
//   isScr: { type: Boolean, default: false },
//   age: { type: Number, required: true },
//   profile: profileSchema,
//   price: {
//     type: Number,
//     min: [100, "price not less than 100"],
//     max: [1000, "not more than 1000"],
//   },
//   createdAt: { type: Date, default: Date.now() },
//   tags: [String],
// });

// userSchema.pre("save", function (next) {
//   if (this.age > 60) this.isScr = true;
//   this.fullName = this.firstName + " " + this.lastName;
//   next();
// });

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
    password: { type: String, required: true, trim: true },
    lastMessageTime: {
      type: Date,
      default: null,
    },
    lastLoggedInDate: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
