const router = require("express").Router();
const {
  register,
  login,
  getUsers,
  processUser,
  getNonAcceptedRestaurateur,
  registerClient
} = require("../controllers/userController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/register",register);
router.post("/registerClient",registerClient);
router.post("/login",login);
router.put("/processUser/:userId", roleAuth(["admin"]), processUser);
router.get("/", roleAuth(["admin"]), getUsers);
router.get("/list", roleAuth(["admin"]), getNonAcceptedRestaurateur);



module.exports = router;