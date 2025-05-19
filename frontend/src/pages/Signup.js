// Get user's bookings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a booking
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { date, time } = req.body;
    const existing = await Booking.findOne({ date, time });
    if (existing)
      return res.status(400).json({ message: "Time slot already booked" });

    const booking = new Booking({ userId: req.user.id, date, time });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel a booking
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await booking.remove();
    res.json({ message: "Booking canceled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
