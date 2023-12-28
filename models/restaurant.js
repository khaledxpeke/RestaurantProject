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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user:{
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

const Restaurant = Mongoose.model("Restaurant", RestaurantSchema);
module.exports = Restaurant;
