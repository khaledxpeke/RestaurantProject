const Restaurant = require("../models/restaurant");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const multer = require("multer");
const multerStorage = require("../middleware/multerStorage");
const upload = multer({ storage: multerStorage });
const fs = require("fs");

exports.createRestaurant = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: "Image upload failed",
        error: err.message,
      });
    }
    if (!req.file) {
      return res.status(400).json({
        message: "Ajouter une image",
        error: "Please upload an image",
      });
    }
    const userId = req.user.user._id;
    const { name, phone, address } = req.body;
    const image = req.file.path;
    try {
      const restaurant = new Restaurant({
        name,
        phone,
        address,
        user: userId,
      });
      if (image) {
        restaurant.image = image;
        await restaurant.save();
      }
      await restaurant.save();
      res
        .status(201)
        .json( restaurant);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
};
exports.getRestaurants = async (req, res) => {
  const userId = req.user.user._id;
  const userRole = req.user.user.role;
  try {
    if (userRole === "restaurateur") {
      const restaurants = await Restaurant.find({ user: userId }).populate(
        "user"
      );
      res.status(200).json(restaurants).populate("user");
    } else {
      const restaurants = await Restaurant.find({});
      res.status(200).json(restaurants);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    const { restaurantId } = req.params;
    const { name, phone, address } = req.body;
    if (err) {
      return res.status(400).json({
        message: "Image upload failed",
        error: err.message,
      });
    }
    if (!req.file) {
      return res.status(400).json({
        message: "Ajouter une image",
        error: "Please upload an image",
      });
    }
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }
    if (req.file) {
      if (restaurant.image) {
        fs.unlinkSync(restaurant.image);
      }
      restaurant.image = req.file.path;
    }
    try {
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        restaurantId,
        {
          name: name || restaurant.name,
          phone: phone || restaurant.phone,
          address: address || restaurant.address,
          image: restaurant.image,
        }
      );
      res
        .status(200)
        .json({ updatedRestaurant, message: "Restaurant modifié avec succès" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

exports.deleteRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        message: "il n'y a pas de Restaurant avec cet id",
      });
    }
    if (restaurant.image) {
      fs.unlink(restaurant.image, (err) => {
        if (err) {
          res.status(500).json({
            message: "Aucune Restaurant image trouvé",
          });
        }
      });
    }
    await Restaurant.findByIdAndDelete(restaurantId);
    res.status(200).json({
      message: "Restaurant supprimer avec succées",
    });
  } catch (error) {
    res.status(400).json({
      message: "Some error occured",
      error: error.message,
    });
  }
};

