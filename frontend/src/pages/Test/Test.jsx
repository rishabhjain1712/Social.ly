import React, { useState } from "react";

const Test = () => {
  const [numbers, setNumbers] = useState([]);
  const [availableNumbers, setAvailableNumbers] = useState([...Array(16).keys()].map(i => i + 1));

  const generateNumber = () => {
    if (availableNumbers.length === 0) {
      alert("All numbers have been generated!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const newNumber = availableNumbers[randomIndex];

    setNumbers(prevNumbers => [...prevNumbers, newNumber]);
    setAvailableNumbers(prevAvailableNumbers =>
      prevAvailableNumbers.filter(number => number !== newNumber)
    );
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday"];
  const groupedNumbers = Array(4)
    .fill([])
    .map((_, index) => numbers.slice(index * 4, index * 4 + 4));

  return (
    <div style={{ padding: "2rem", textAlign: "center", height: "100vh" }}>
      <button
        onClick={generateNumber}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Generate Number
      </button>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        {days.map((day, dayIndex) => (
          <div
            key={day}
            style={{
              margin: "0 1rem",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                backgroundColor: "#00bfff",
                color: "#fff",
                padding: "0.5rem",
                borderRadius: "5px",
              }}
            >
              {day}
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              {groupedNumbers[dayIndex]?.map((num, index) => (
                <span
                  key={`${day}-${index}`}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "1rem",
                  }}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Test;
