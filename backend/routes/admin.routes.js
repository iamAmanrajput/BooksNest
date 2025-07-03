const express = require("express");
const router = express.Router();

const {
  adminSignin,
  adminSignup,
  adminLogout,
} = require("../controllers/admin.controller");
const { isLoggedIn } = require("../middlewares/verifyToken");

router.post("/admin/signup", adminSignup);

router.post("/admin/signin", adminSignin);

router.get("/admin/logout", isLoggedIn, adminLogout);

module.exports = router;
