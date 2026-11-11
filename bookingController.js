import Booking from "../models/Booking.js";
import Lawyer from "../models/Lawyer.js";

export async function createBooking(req, res) {
  try {
    const { lawyerId, appointmentDate, message = "" } = req.body;
    if (!lawyerId || !appointmentDate) {
      return res.status(400).json({ message: "Choose a lawyer and appointment date." });
    }
    const date = new Date(appointmentDate);
    if (Number.isNaN(date.getTime()) || date <= new Date()) {
      return res.status(400).json({ message: "Choose a valid future appointment date." });
    }
    const lawyer = await Lawyer.findOne({ _id: lawyerId, available: true });
    if (!lawyer) return res.status(404).json({ message: "Lawyer not found or unavailable." });

    const booking = await Booking.create({
      client: req.user._id,
      lawyer: lawyer._id,
      appointmentDate: date,
      message
    });
    await booking.populate("lawyer", "name specialization consultationFee");
    res.status(201).json({ message: "Consultation request submitted.", booking });
  } catch (error) {
    res.status(500).json({ message: "Could not create booking.", error: error.message });
  }
}

export async function getMyBookings(req, res) {
  try {
    const bookings = await Booking.find({ client: req.user._id })
      .populate("lawyer", "name specialization consultationFee")
      .sort({ appointmentDate: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Could not load bookings.", error: error.message });
  }
}
