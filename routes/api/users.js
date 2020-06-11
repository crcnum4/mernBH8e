const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const User = require("../../models/User");

// @route		POST api/users
// @desc		create new user
// @access	public
router.post(
  "/",
  [
    check("email", "Email Required").not().isEmpty(),
    check("email", "Valid Email Required").isEmail(),
    check(
      "password",
      "Please enter a password with at least 6 characters."
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const userData = { email, password };

    try {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      // create the code that will check if the email is already in use before creating the new user.
      const user = await User.create(userData);

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
);

module.exports = router;
