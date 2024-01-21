const Mongoose = require("mongoose");
const RestaurantSchema = new Mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Restaurant = Mongoose.model("Restaurant", RestaurantSchema);
module.exports = Restaurant;
