const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { validate } = require("./message");
const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      // Basic custom validation
      validate: {
        validator: function (value) {
          return value.length >= 3;
        },
        message: "Username must be at least 3 character long",
      },
    },

    email: {
      type: String,
      unique: true,
      validate: [
        {
          validator: function (value) {
            return /\S+@\S+\.\S+/.test(value);
          },
          message: "Email address is not valid",
        },
        {
          validator: async function (value) {
            const user = await mongoose.models.User.findOne({ email: value });
            return !user;
          },
          message: "Email already exists",
        },
      ],
    },
    password: { type: String },
    lastLoggedInDate: { type: Date, default: null },
    backgroundColor: { type: String, default: "#ffffff" },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

//validate
userSchema.pre("validate", function (next) {
  const user = this;

  if (this.username) user.username = this.username.trim();

  if (this.email) this.email = this.email.trim().toLowerCase();

  if (this.password.length < 6)
    this.invalidate("password", "Password must be at least 6 characters");

  next();
});

// Pre hook
userSchema.pre("save", async function (next) {
  const user = this;
  console.log(this.isNew);
  console.log(this.isModified("password"));

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
