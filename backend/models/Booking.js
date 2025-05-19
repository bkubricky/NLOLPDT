// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: String, required: true }, // store as YYYY-MM-DD
  slot: { type: String, required: true }, // e.g., "10:00 AM - 11:00 AM"
});

bookingSchema.index({ date: 1, slot: 1 }, { unique: true }); // prevent double bookings

module.exports = mongoose.model("Booking", bookingSchema);
