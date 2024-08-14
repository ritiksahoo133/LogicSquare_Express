const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      index: "2dsphere",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
