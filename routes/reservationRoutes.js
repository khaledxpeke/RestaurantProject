const router = require("express").Router();
const {
createReservation,
getReservations,
processReservation,
} = require("../controllers/reservationController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/:restaurantId", roleAuth(["client"]),createReservation);
router.get("/:restaurantId", roleAuth(["restaurateur","client"]), getReservations);
router.put("/:reservationId", roleAuth(["restaurateur"]), processReservation);


module.exports = router;