const express = require("express");
const router = express.Router();

const { getProfileStats } = require("../controllers/profile.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.get("/stats", isLoggedIn, getProfileStats);

module.exports = router;
