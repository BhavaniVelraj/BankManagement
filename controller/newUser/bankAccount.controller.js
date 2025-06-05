const Account = require('../models/accountModel');
const User = require('../models/userModel');

// Helper to generate 12-digit account number
function generateAccountNumber() {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

exports.createAccount = async (req, res) => {
  try {
    const { userId, accountType, initialDeposit } = req.body;

    if (!userId || !accountType) {
      return res.status(400).json({ success: false, message: 'User ID and Account Type are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const existingAccount = await Account.findOne({ user: userId });
    if (existingAccount) {
      return res.status(400).json({ success: false, message: 'Account already exists for this user' });
    }

    const account = new Account({
      user: userId,
      accountNumber: generateAccountNumber(),
      accountType,
      balance: initialDeposit || 0,
    });

    await account.save();

    res.status(201).json({
      success: true,
      message: 'Bank account created successfully',
      data: account,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().populate('user', 'name email');
    res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAccountByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const account = await Account.findOne({ user: userId }).populate('user', 'name email');

    if (!account) return res.status(404).json({ success: false, message: 'Account not found' });

    res.status(200).json({ success: true, data: account });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
