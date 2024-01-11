const User = require("../models/user");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());

exports.register = async (req, res) => {
  const { email, firstName, lastName, phone,restaurantName,address } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    const newUser = new User({
      email,
      role: "restaurateur",
      firstName,
      lastName,
      phone,
      restaurantName,
      address,
      password: await bcrypt.hash(phone, await bcrypt.genSalt(10)),
    });

    await newUser.save();

    const payload = {
      user: {
        id: newUser._id,
        role: newUser.role,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.cookie("jwt", token, { httpOnly: true, maxAge: 360000 });
      res.json({ token, newUser,message:"restaurateur ajouté avec succées" });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Erreur du serveur",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Check if the provided password matches the stored password
    const isPasswordMatch = bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "les informations d'identification invalides" });
    }

    if (user.role === "restaurateur" && !user.isApproved) {
        return res.status(403).json({ message: "Account not approved" });
      }
    const maxAge = 8 * 60 * 60;
    const payload = {
      user: user,
      role: user.role,
    };
    console.log(payload);
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: maxAge },
      (err, token) => {
        if (err) throw err;
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Erreur du serveur",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({role:"restaurateur",isApproved:true});
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
    const users = await User.find({role:"restaurateur",isApproved:false});
    if (!users) {
      return res.status(404).json({ message: "Aucun utilisateurs non acceptée trouvée" });
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
        return res.status(200).json({ message: "User refused and deleted successfully" });
      } else {
        return res.status(400).json({ message: "Invalid action" });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };