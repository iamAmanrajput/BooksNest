const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/auth.controller");
const { isLoggedIn } = require("../middlewares/verifyToken");

router.post("/register", register);

router.post("/login", login);

router.get("/logout", isLoggedIn, logout);

module.exports = router;
