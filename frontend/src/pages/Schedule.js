// src/pages/Schedule.js
import React, { useState } from "react";

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const Schedule = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleBook = (slot) => {
    setSelectedSlot(slot);
    // TODO: Call backend to save booking
    alert(`Booked: ${slot} (not yet functional)`);
  };

  return (
    <div>
      <h2>Book a Training Session</h2>
      <div className="row">
        {timeSlots.map((slot, index) => (
          <div className="col-md-3 mb-3" key={index}>
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => handleBook(slot)}
            >
              {slot}
            </button>
          </div>
        ))}
      </div>
      {selectedSlot && <p className="mt-3">You selected: {selectedSlot}</p>}
    </div>
  );
};

export default Schedule;
