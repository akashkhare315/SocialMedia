const express = require("express");
const { getUserProfile } = require("../controller/user.controller");

const router = express.Router();

router.get("/:username", getUserProfile);

module.exports = router;
