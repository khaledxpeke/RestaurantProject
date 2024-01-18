const Plat = require("../models/plat");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const multer = require("multer");
const multerStorage = require("../middleware/multerStorage");
const upload = multer({ storage: multerStorage });
const fs = require("fs");

exports.createPlat = async (req, res) => {
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
    const { restaurantId } = req.params;
    const { name, price } = req.body;
    const image = req.file.path;
    try {
      let plat = await Plat.findOne({ restaurantId, name });

      if (plat) {
        return res.status(400).json({
          message: "Plat existe déja",
        });
      } else {
        plat = new Plat({
          name,
          price,
          restaurant: restaurantId,
        });
        if (image) {
          plat.image = image;
          await plat.save();
        }

        await plat.save();
        res.status(201).json({ plat, message: "Plat créé avec succès" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
};
