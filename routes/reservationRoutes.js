const router = require("express").Router();
const {
createReservation,
getReservations,
processReservation,
getClientReservations,
} = require("../controllers/reservationController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/:restaurantId", roleAuth(["client"]),createReservation);
router.get("/:restaurantId", roleAuth(["restaurateur","admin"]), getReservations);
router.get("/", roleAuth(["client"]), getClientReservations);
router.put("/:reservationId", roleAuth(["restaurateur"]), processReservation);


module.exports = router;