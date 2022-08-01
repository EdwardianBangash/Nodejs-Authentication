const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");
const { authMiddleware, checkAuth } = require("../middleware/auth");

router.get("/", checkAuth,(req, res) => {
  res.render("index");
});

router.get("/login", checkAuth, (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/dashboard", authMiddleware, (req, res) => {
  res.render("dashboard", { user: req.user });
});

router.get("/logout", controller.userLogoutRoute);
  

router.post("/register", controller.userRegisterRoute);
router.post("/login", checkAuth, controller.userLoginRoute);

module.exports = router;
