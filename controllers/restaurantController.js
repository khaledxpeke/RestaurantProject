const Restaurant = require("../models/restaurant");
const express = require("express");
const app = express();
const User = require("../models/user");
require("dotenv").config();
app.use(express.json());

exports.createRestaurant = async (req, res) => {
    const userId = req.user.user._id;
  const { name, phone, address } = req.body;
  try {
    const restaurant = new Restaurant({
      name,
      phone,
      address,
      user:userId,
    });
    await restaurant.save();
    res
      .status(201)
      .json({ restaurant, message: "Restaurant créé avec succès" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getRestaurants = async (req, res) => {
  const userId = req.user.user._id;
  const userRole = req.user.user.role;
  try {
    if (userRole === "restaurant") {
      const restaurants = await Restaurant.find({ user: userId }).populate(
        "user"
      );
      res.status(200).json(restaurants);
    } else {
      const restaurants = await Restaurant.find({});
      res.status(200).json(restaurants);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
