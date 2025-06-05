const bcrypt = require("bcrypt");
const database = require("../../database/database");
const Admin = database.admins;

// Register new admin
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).send("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: role || "manager"
    });

    await newAdmin.save();
    res.status(201).send("Admin registered successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// Login via email or ID
exports.login = async (req, res) => {
  try {
    const { emailOrId, password } = req.body;

    let admin = await Admin.findOne({ email: emailOrId });
    if (!admin) {
      admin = await Admin.findById(emailOrId);
      if (!admin) return res.status(404).send("Admin not found");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).send("Invalid password");

    res.send({
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
