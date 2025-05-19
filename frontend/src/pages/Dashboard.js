import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // format yyyy-mm-dd
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    async function fetchSlots() {
      try {
        const res = await fetch(`/api/slots?date=${selectedDate}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // send token for auth
          },
        });
        if (!res.ok) throw new Error("Failed to fetch slots");
        const data = await res.json();
        setAvailableSlots(data.slots);
        setSelectedSlot(null);
      } catch (err) {
        console.error(err);
        setAvailableSlots([]);
      }
    }
    fetchSlots();
  }, [selectedDate]);

  const handleBook = async () => {
    if (!selectedSlot) {
      alert("Please select a time slot first.");
      return;
    }
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          slot: selectedSlot,
          userId: user.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");
      alert(`Booked ${selectedDate} at ${selectedSlot} successfully!`);
      // Refresh slots after booking
      setAvailableSlots((prev) => prev.filter((slot) => slot !== selectedSlot));
      setSelectedSlot(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Welcome, {user?.name || "User"}!</h2>
      <p>You are logged in as {user?.email}</p>

      <button onClick={handleLogout} className="btn btn-danger mt-3 mb-4">
        Logout
      </button>

      <div className="mb-3">
        <label htmlFor="datePicker" className="form-label">
          Select a date for your training session:
        </label>
        <input
          type="date"
          id="datePicker"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]} // no past dates
        />
      </div>

      <h4>Available 1-hour Time Slots</h4>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {availableSlots.length === 0 && (
          <p>No slots available for this date.</p>
        )}
        {availableSlots.map((slot) => (
          <button
            key={slot}
            className={`btn ${
              selectedSlot === slot ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setSelectedSlot(slot)}
          >
            {slot}
          </button>
        ))}
      </div>

      <button className="btn btn-success" onClick={handleBook}>
        Book Selected Slot
      </button>
    </div>
  );
};

export default Dashboard;
