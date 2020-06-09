const express = require("express");
const router = express.Router();

// @route		POST api/users
// @desc		create new user
// @access	public
router.post("/", (req, res) => {
  res.json(req.body);
});

module.exports = router;
