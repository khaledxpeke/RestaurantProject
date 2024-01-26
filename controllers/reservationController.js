const Restaurant = require("../models/restaurant");
const Reservation = require("../models/reservation");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const transporter = require("../middleware/email");
const User = require("../models/user");

exports.createReservation = async (req, res) => {
  const userId = req.user.user._id;
  const {
    reservationTime,
    reservationDate,
    email,
    numpeople,
    phone,
    commentaire,
  } = req.body;
  const { restaurantId } = req.params;
  try {
    const reservation = new Reservation({
      reservationTime,
      reservationDate,
      numpeople,
      phone,
      email,
      status: "en cours",
      commentaire,
      user: userId,
      restaurant: restaurantId,
    });
    await reservation.save();

    res
      .status(201)
      .json({ reservation, message: "reservation ajouté avec succées" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getReservations = async (req, res) => {
  const userRole = req.user.user.role;
  const { restaurantId } = req.params;
  try {
    if (userRole === "restaurateur") {
      const reservations = await Reservation.find({
        restaurant: restaurantId,
      }).populate("user");
      res.status(200).json(reservations);
    } else if (userRole === "client") {
      const userId = req.user.user._id;
      const reservations = await Reservation.find({
        user: userId,
        restaurant: restaurantId,
      })
        .populate("restaurant")
        .sort({ createdAt: -1 });
      res.status(200).json(reservations);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.processReservation = async (req, res) => {
  const userId = req.user.user._id;
  const { reservationId } = req.params;
  const { status } = req.body;
  const user = await User.findById(userId);
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Aucun réservation trouvée" });
    }
    const allowedStatus = ["acceptée", "refusée", "en cours"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status invalide" });
    }
    reservation.status = status;
    await reservation.save();
    if (status === "acceptée") {
      await transporter.sendMail({
        from: "khaledbouajila5481@gmail.com",
        to: reservation.email,
        subject: "Reservation!",
        text:
          "Bonjour " +
          user.firstName +
          " " +
          user.lastName +
          ",\n\n Votre réservation at " +
          reservation.reservationDate +
          " || " +
          reservation.reservationTime +
          " a été acceptée" +
          ".\n\nMerci beaucoup!",
      });
    } else if (status === "refusée") {
      await transporter.sendMail({
        from: "khaledbouajila5481@gmail.com",
        to: reservation.email,
        subject: "Reservation!",
        text:
          "Bonjour " +
          user.firstName +
          " " +
          user.lastName +
          ",\n\n Votre réservation at " +
          reservation.reservationDate +
          " || " +
          reservation.reservationTime +
          " a été refusée" +
          ".\n\n Nous somme désolée!",
      });
    }
    res.status(200).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};