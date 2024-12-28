import React, { useState } from "react";

const MonthSelector = () => {
  const [firstMonth, setFirstMonth] = useState("");
  const [lastMonth, setLastMonth] = useState("");

  const handleConfirm = () => {
    const selectedData = { firstMonth, lastMonth }; // Example data to send
    window.opener.postMessage(selectedData, window.location.origin);
    window.close(); // Close the popup
  };
  

  const handleCancel = () => {
    window.close(); // Close the popup without doing anything
  };

  return (
    <div>
      <h2>Select Month Range</h2>
      <label>
        First Month:
        <input
          type="number"
          value={firstMonth}
          onChange={(e) => setFirstMonth(e.target.value)}
        />
      </label>
      <br />
      <label>
        Last Month:
        <input
          type="number"
          value={lastMonth}
          onChange={(e) => setLastMonth(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default MonthSelector;
