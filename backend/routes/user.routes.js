const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  changeAccountStatus,
} = require("../controllers/user.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.get("/getUsers", isLoggedIn, isAdmin, getAllUsers);
router.patch("/changeStatus/:id", isLoggedIn, changeAccountStatus);

module.exports = router;
