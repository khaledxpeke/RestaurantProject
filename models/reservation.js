const Mongoose = require("mongoose");
const ReservationSchema = new Mongoose.Schema({
  reservationTime: {
    type: String,
    required: true,
  },
  reservationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  numpeople: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  commentaire: {
    type: String,
  },
  status: {
    type: String,
    enum: ["en cours", "acceptée", "refusée"],
    default: "en cours",
  },
  user: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurant: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

const Reservation = Mongoose.model("Reservation", ReservationSchema);
module.exports = Reservation;
