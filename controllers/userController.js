const User = require("../models/user");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());


exports.register = async (req, res) => {
  const { email, firstName, lastName, phone, password,restaurantName, address } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        email,
        role: "restaurateur",
        firstName,
        lastName,
        phone,
        address,
        restaurantName,
        password: hash,
      })
        .then((user) => {
          const maxAge = 8 * 60 * 60;

          const payload = {
            user: {
              id: user._id,
              role: user.role,
            },
          };
          const token = jwt.sign(payload, jwtSecret, {
            expiresIn: maxAge, 
          });
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, 
          });
          res.status(201).json({
            user: user,
            token: token,
            message: "Votre compte a été créé avec succès",
          });
        })
        .catch((error) =>
          res.status(400).json({
            message: "This name already exists",
            error: error.message,
          })
        );
    });
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.registerClient = async (req, res) => {
  const { email, firstName, lastName, phone, password, address } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        email,
        role: "client",
        firstName,
        lastName,
        phone,
        address,
        password: hash,
      })
        .then((user) => {
          const maxAge = 8 * 60 * 60;

          const payload = {
            user: {
              id: user._id,
              role: user.role,
            },
          };
          const token = jwt.sign(payload, jwtSecret, {
            expiresIn: maxAge, 
          });
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, 
          });
          res.status(201).json({
            user: user,
            token: token,
            message: "Votre compte a été créé avec succès",
          });
        })
        .catch((error) =>
          res.status(400).json({
            message: "This name already exists",
            error: error.message,
          })
        );
    });
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        message: "Aucun utilisateur trouvée",
        error: "Aucun utilisateur trouvée",
      });
    } else {
      // if (user.role === "restaurateur" && !user.isApproved) {
      //   return res.status(403).json({ message: "Account not approved" });
      // }
      bcrypt.compare(password, user.password).then(function (result) {
        console.log(result)
        if (result) {
          const maxAgeInSeconds = 8 * 60 * 60 * 24 * 365;
          const maxAgeInMilliseconds = maxAgeInSeconds * 1000;
          const tokenPayload = {
            user: user,
          };
          const token = jwt.sign(tokenPayload, jwtSecret, {
            expiresIn: maxAgeInSeconds, // 3hrs in sec
          });
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAgeInMilliseconds * 1000, // 3hrs in ms
          });
          res.status(200).json({
            token: token,
          });
        } else {
          res
            .status(400)
            .json({ message: "les informations d'identification invalides!" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "restaurateur", isApproved: true });
    if (!users) {
      return res.status(404).json({ message: "Aucun utilisateurs trouvée" });
    }
    res.status(200).json(users);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "utilisateurs introuvables",
    });
  }
};

exports.getNonAcceptedRestaurateur = async (req, res) => {
  try {
    const users = await User.find({ role: "restaurateur", isApproved: false });
    if (!users) {
      return res
        .status(404)
        .json({ message: "Aucun utilisateurs non acceptée trouvée" });
    }
    res.status(200).json(users);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "utilisateurs introuvables",
    });
  }
};

exports.processUser = async (req, res) => {
  const { userId } = req.params;
  const { action } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (action === "accept") {
      user.isApproved = true;
      await user.save();
      return res.status(200).json({ message: "User accepted successfully" });
    } else if (action === "decline") {
      await User.findByIdAndDelete(userId);
      return res
        .status(200)
        .json({ message: "User refused and deleted successfully" });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
