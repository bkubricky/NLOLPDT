// routes/slots.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

const ALL_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

// GET /api/slots?date=YYYY-MM-DD
router.get("/", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Date is required" });

  try {
    const bookings = await Booking.find({ date });
    const bookedSlots = bookings.map((b) => b.slot);
    const availableSlots = ALL_SLOTS.filter(
      (slot) => !bookedSlots.includes(slot)
    );
    res.json({ slots: availableSlots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
