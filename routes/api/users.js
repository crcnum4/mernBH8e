const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const isEmpty = require("../../utils/isEmpty");
const config = require("../../config");

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
    const userData = { email: email.toLowerCase(), password };

    try {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      // create the code that will check if the email is already in use before creating the new user.
      const existing = await User.findOne({ email: userData.email });

      if (!isEmpty(existing)) {
        return res.status(400).json({ email: "email exists" });
      }

      const user = await User.create(userData);

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
);

// @route		PUT api/users/
// @desc		login a user
// @access	public
router.put(
  "/",
  [
    check("email", "Email Required").not().isEmpty(),
    check("email", "Valid Email Required").isEmail(),
    check("password", "Password Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ email: req.body.email.toLowerCase() });

      if (isEmpty(user)) {
        return req.status(404).json({ email: "email not found" });
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        return req.status(401).json({ password: "incorrect password" });
      }

      // validated! challenge create the token and return it to the user.

      User.findByIdAndUpdate(user.id, { lastLogin: Date.now() });

      const payload = {
        id: user.id,
        // email: user.email,
        //iat: Date
      };

      const token = jwt.sign(payload, config.secretOrKey, {});

      return res.json(token);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
);

module.exports = router;
