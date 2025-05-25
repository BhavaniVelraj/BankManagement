const database = require('../../database/database');
const bcrypt = require("bcrypt");


const user = database.users;

async function register(req, res, next) {
    try {
        const { name, dob, email, phone, password, user_type, verify_token, login_status } = req.body;

        // Basic email format check
        const isValidEmail = /\S+@\S+\.\S+/.test(email);
        if (!isValidEmail) {
            return res.status(400).json({ status: "Failed", message: "Invalid email format" });
        }

        // Check if email already exists
        const emailCheck = await user.findOne({ email: email }).exec();
        if (emailCheck) {
            return res.status(409).json({ status: "Failed", message: "Email already exists" });
        }

        // Check if phone already exists
        const phoneCheck = await user.findOne({ phone: phone }).exec();
        if (phoneCheck) {
            return res.status(409).json({ status: "Failed", message: "Phone number already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save the new user
        const newUser = new user({
            name: name,
            dob: dob,
            email: email,
            phone: phone,
            password: hashedPassword,
            user_type: user_type,
            verify_token: verify_token,
            login_status: login_status
        });

        await newUser.save();

        return res.status(201).json({ status: "Success", message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Failed", message: "Internal server error" });
    }
}
async function getAllUsers(req, res) {
    try {
        const usersList = await user.find().exec();
        return res.status(200).json({ status: "Success", data: usersList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Failed", message: "Internal server error" });
    }
}


async function getSingleUser(req, res) {
    try {
        const id = req.params.id;

        const userData = await user.findOne({ "_id": id }).exec();

        if (!userData) {
            return res.status(404).json({ status: "Failed", message: "User not found" });
        }

        return res.status(200).json({ status: "Success", data: userData });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Failed", message: "Internal server error" });
    }
}
async function updateUser(req, res) {
    try {
        let id = req.params.id
        let update = req.body
        let option = { new: true }
        const updateData = await user.findOneAndUpdate({ _id: id }, update, option).exec();
        if (!updateData) {
            return res.status(404).json({ status: "Failed", message: "Not Updated" });

        }
        return res.status(200).json({ status: "Success", data: updateData });
    } catch {
        return res.status(500).json({ status: "Failed", message: "Internal server error" });
    }


}
async function deleteUser(req,res){
    try{
        let id = req.params.id
        const deleteData = await user.findByIdAndDelete({_id:id}).exec();
        if(!deleteData){
            return res.status(404).json({ status: "Failed", message: "can not Deleetd this" });
        }
        return res.status(200).json({ status: "Success", data: deleteData });
    } catch {
        return res.status(500).json({ status: "Failed", message: "Internal server error" });
    }
   
  


}



module.exports = { register, getAllUsers, getSingleUser, updateUser,deleteUser };
