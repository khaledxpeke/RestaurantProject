const router = require("express").Router();
const {
  register,
  login,
  getUsers,
  processUser,
} = require("../controllers/userController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/register",register);
router.post("/login",login);
router.put("/processUser/:userId", roleAuth(["admin"]), processUser);
router.get("/", roleAuth(["admin"]), getUsers);



module.exports = router;