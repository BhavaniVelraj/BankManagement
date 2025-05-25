const express = require('express');
const router = express.Router();
const user = require("../../controller/newUser/user.controller");

router.post('/register',user.register);
router.get('/getAllUsers',user.getAllUsers)
router.get("/:id",user.getSingleUser);
router.put("/:id",user.updateUser);
router.delete("/:id",user.deleteUser);



module.exports = router
