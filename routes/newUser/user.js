const express = require('express');
const router = express.Router();
const user = require("../../controller/newUser/user.controller");

router.post('/register',user.register);
router.get('/getAllUsers',user.getAllUsers)
router.get("/user/:id",user.getSingleUser);
router.put("/user/:id",user.updateUser);
router.delete("/user/:id",user.deleteUser);
router.get("/login", user.login);
router.put("/logout", user.logout);



module.exports = router
