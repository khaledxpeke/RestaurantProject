const express = require("express");
const app = express();
const connectDB = require("./db/db");
const cors = require("cors");
const { roleAuth } = require("./middleware/auth");
app.timeout = 300000;
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
server = app.listen(3300, function () {
  console.log("Server is listening on port 3300");
});


app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/restaurant", require("./routes/restaurantRoutes"));
app.use("/api/plat", require("./routes/platRoutes"));
app.use("/api/reservation", require("./routes/reservationRoutes"));
app.use("/api/uploads", express.static("uploads"));