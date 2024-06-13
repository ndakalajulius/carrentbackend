const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/car_rental', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Car Schema
const carSchema = new mongoose.Schema({
    name: String,
    model: String,
    year: Number,
    available: Boolean,
});

const Car = mongoose.model('Car', carSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
    carId: mongoose.Schema.Types.ObjectId,
    userId: String,
    startDate: Date,
    endDate: Date,
});

const Booking = mongoose.model('Booking', bookingSchema);

// Routes
app.get('/cars', async (req, res) => {
    const cars = await Car.find({ available: true });
    res.json(cars);
});

app.post('/book', async (req, res) => {
    const { carId, userId, startDate, endDate } = req.body;
    const newBooking = new Booking({ carId, userId, startDate, endDate });
    await newBooking.save();
    await Car.findByIdAndUpdate(carId, { available: false });
    res.status(201).send('Car booked successfully');
});

app.get('/bookings', async (req, res) => {
    const bookings = await Booking.find().populate('carId');
    res.json(bookings);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
