//test route
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route		Get api/posts/test
// @desc		Test route
// @access	Public
router.get("/test", (req, res) => {
  res.json({ message: "This is the test route" });
});

// @route		POST api/posts
// @desc		create a new post
// @access	private
router.post(
  "/",
  auth,
  [
    check("author", "Author is required").notEmpty(),
    check("skillLevel", "Skill Level is required").notEmpty(),
    check("skillLevel", "Select from dropdown").isIn([
      "Beginner",
      "Intermediate",
      "Advanced",
      "Associate",
      "Junior",
      "Senior",
      "Lead",
    ]),
    check("title", "Title is required").notEmpty(),
    check("link", "A useable link is required").notEmpty(),
    check("link", "Valid URL Required!").isURL(),
    check("resourceType", "A Valid Resource Type is required ").notEmpty(),
    check("resourceType", "Select from dropdown").isIn([
      "Article",
      "Video",
      "SlideShow",
      "Book",
      "eBook",
      "PDF",
      "PodCast",
      "Website",
      "Newsletter",
      "Blog",
      "Other",
    ]),
    check("cost", "Cost is required").notEmpty(),
    check("cost", "A valid number is required").isNumeric(),
    check("publishedAt", "Invalid Date").optional().isISO8601(),
    check("videoLength", "Length of Video must be in whole minutes")
      .optional()
      .isInt(),
    check("timeToComplete", "Time it took to complete must be a number")
      .optional()
      .isNumeric(),
  ],
  async (req, res) => {
    console.log("hello");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //David
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const profileId = profile._id;

      // find profile with userId so we can extract the profile._id
      // attach the profileId to the postData
      const postData = { ...req.body };
      postData.poster = profileId;
      // create a new post

      const post = await Post.create(postData);
      res.json(post);
      // respond with new post
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
);

module.exports = router;
