// create the post (register profile) route. for now make it a public url and expect userid in the body.
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const { check, validationResult } = require("express-validator/check");

const Profile = require("../../models/Profile");

// @route     GET '/api/profiles/:id'
// @desc      get a profile by id.
// @access    Private -> Registered users.
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ msg: "Profile Not Found" });
    }
    res.json({ profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error.", error });
  }
});
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ username: 1 });
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error." });
  }
});
//@route  POST api/profile
//@desc   Create or update user profile
//@access Private
router.post(
  "/",
  auth,
  [
    check("firstName", "first name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("educationLevel", "Education level is required").not().isEmpty(),
    check("githubUrl", "Invalid URL").optional().isURL(),
    check("twitterUrl", "Invalid URL").optional().isURL(),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        firstName,
        lastName,
        occupation,
        educationLevel,
        certifications,
        location,
        githubUrl,
        twitterUrl,
        youtubeUrl,
        summary,
      } = req.body;
      const userId = req.user.id;
      const profileFields = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        educationLevel,
      };
      //profileFields.name = `${profileFields.firstName} ${profileFields.lastName}`;
      profileFields.user = userId;
      if (occupation) profileFields.occupation = occupation;
      if (certifications) profileFields.certifications = certifications;
      if (location) profileFields.location = location;
      if (summary) profileFields.summary = summary;
      profileFields.social = {};
      if (githubUrl) profileFields.social.githubUrl = githubUrl;
      if (twitterUrl) profileFields.social.twitterUrl = twitterUrl;
      if (youtubeUrl) profileFields.social.youtubeUrl = youtubeUrl;
      const profile = await Profile.create(profileFields);
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.put(
  "/",
  auth,
  [
    check("firstName", "first name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("educationLevel", "Education level is required").not().isEmpty(),
    check("githubUrl", "Invalid URL").optional().isURL(),
    check("twitterUrl", "Invalid URL").optional().isURL(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      //console.log(profile);
      //console.log(profile._id);
      if (!profile) {
        res.status(404).json({ msg: "no profile" });
      }
      const profileData = { ...req.body };
      const updatedProfile = await Profile.findByIdAndUpdate(
        profile._id,
        profileData,
        { new: true }
      );
      res.json(updatedProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
);

router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    res.json({ msg: "Profile has been deleted !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error." });
  }
});
module.exports = router;
