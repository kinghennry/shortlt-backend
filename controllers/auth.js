const User = require("../models/User");
const ResetToken = require("../models/resetToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendError, createRandomBytes } = require("../utils/helper");
const {
  generatePasswordResetTemplate,
  mailTransport,
} = require("../utils/mail");

const register = async (req, res) => {
  try {
    // check for already used username,
    const oldUserName = await User.findOne({
      username: req.body.username,
    });
    if (oldUserName)
      return res.status(401).json({ message: "Username already exists" });
    //check for already used email
    const oldEmail = await User.findOne({ email: req.body.email });
    if (oldEmail)
      return res.status(401).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    //register user.
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json("Server Error Occured");
    console.log(err);
  }
};

const login = async (req, res) => {
  try {
    // check if there is user.
    const user = await User.findOne({ username: req.body.username });

    if (!user)
      return res
        .status(401)
        .json({ message: "Incorrect Username or Password!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const validated = await bcrypt.compare(req.body.password, hashedPass);

    !validated && res.status(400).json("Incorrect Password");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json("Server Error Occured");
    console.log(err);
  }
};

const forgotPassword = async (req, res) => {
  //check for already used email
  const oldMail = await User.findOne({ email: req.body.email });
  if (!oldMail) return sendError(res, "Email does not exist!.");

  const token = await ResetToken.findOne({ owner: oldMail._id });
  if (token)
    return sendError(res, "You can request for a new Token After 6 Minutes!.");
  const randomBytes = await createRandomBytes();
  const resetToken = new ResetToken({ owner: oldMail._id, token: randomBytes });
  await resetToken.save();

  mailTransport().sendMail({
    from: "ShortlyReset@gmail.com",
    to: oldMail.email,
    subject: "Password Reset",
    html: generatePasswordResetTemplate(
      `http://localhost:3000/reset-password?token=${randomBytes}$id=${oldMail._id}`
    ),
  });

  res.json({
    success: true,
    message: "Password Reset Link is sent to your mail.",
  });
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return sendError(res, "User not found!");

  const isSamePassword = await user.comparePassword(password);
  if (isSamePassword) return sendError(res, "New Password Must Be Different!");

  if (password.trim().length < 0 || password.trim().length > 20)
    return sendError(res, "New Password Must Be 8 to 20 Characters Long!");

  user.password = password.trim();
  await user.save();

  await ResetToken.findOneAndDelete({ owner: user._id });

  sendMail({
    from: "ShortlyReset@gmail.com",
    to: user.email,
    subject: "Password Reset Successfully",
    html: plainEmailTemplate(
      "Password Reset Successfully",
      "Now you can Login with new Password!"
    ),
  });

  res.json({
    success: true,
    message: "Password Reset Successfully.",
  });
};
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
