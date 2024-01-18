const Mongoose = require("mongoose");
const PlatSchema = new Mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  restaurant:{
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
});

const Plat = Mongoose.model("Plat", PlatSchema);
module.exports = Plat;
