const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let cars = [
  { id: 1, name: "Toyota Camry", pricePerDay: 50, available: true },
  { id: 2, name: "Honda Accord", pricePerDay: 45, available: true },
  { id: 3, name: "Tesla Model 3", pricePerDay: 100, available: true },
];

// API to get list of cars
app.get("/api/cars", (req, res) => {
  res.json(cars);
});

// API to create a booking
app.post("/api/bookings", (req, res) => {
  const { carId, name, days } = req.body;
  const car = cars.find((c) => c.id === carId);
  
  if (car && car.available) {
    car.available = false; // Mark the car as unavailable after booking
    res.json({
      success: true,
      message: `Booking confirmed for ${car.name} by ${name} for ${days} days`,
      totalPrice: car.pricePerDay * days,
    });
  } else {
    res.status(400).json({ success: false, message: "Car is not available" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
