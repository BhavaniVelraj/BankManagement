const express = require("express");
const router = express.Router();
const adminController = require("../../controller/admin/admin.controller");

router.post("/register", adminController.register);
router.get("/login", adminController.login);

module.exports = router;
