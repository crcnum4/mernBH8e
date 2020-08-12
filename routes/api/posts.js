//test route
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

const postValidator = [
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
];

// @route		Get api/posts/test
// @desc		Test route
// @access	Public
router.get("/test", (req, res) => {
  res.json({ message: "This is the test route" });
});

// @route		POST api/posts
// @desc		create a new post
// @access	private
router.post("/", auth, [...postValidator], async (req, res) => {
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
});

// @route		GET api/posts/
// @desc		Get all posts
// @access	public
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("poster", "name Avatar");
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// @route		GET api/posts/:id
// @desc		get a post based on id number
// @access	public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "poster",
      "name Avatar"
    );
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// @route		PUT api/posts/:id
// @desc		update an existing post based on id
// @access	owner
router.put("/:id", auth, [...postValidator], async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      res.status(403).json({ msg: "no profile" });
    }
    const postData = { ...req.body };

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, poster: profile._id },
      postData,
      { new: true }
    );

    if (!post) {
      res.status(403).json({ msg: "Unable to update" });
      // optional check if post exists. if it does respond with 401 unauthorized. if it doesn't respond with 404 not found.
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// router.put('/:id', auth, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if(!post) {
//       return res.status(404).json({ msg: 'Post not found' });
//     }
//     const profile = await Profile.findOne({user: req.user.id});
//     if(profile._id !== post.poster) {
//       return res.status(401).json({ msg: 'User not authorized'});
//     }
//     post = { ...post, ...req.body };

//     post.save();
//     res.json(post);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error);
//   }
// });

// @route		DELETE api/posts/:id
// @desc		delete the post by id
// @access	owner
router.delete("/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      poster: profile._id,
    });
    if (!post) {
      const p = await Post.findById(req.params.id);
      if (!p) {
        return res.status(404).json({ msg: "Post not found" });
      }
      return res.status(401).json({ msg: "Unauthorized!" });
    }
    res.json({ msg: "success!" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// @route		PUT api/posts/:postID/like
// @desc		like a post based on ID
// @access	private
router.put("/:postID/like", auth, async (req, res) => {
  try {
    let post;
    if (req.body.like) {
      // add the user id to likes
      post = await Post.findByIdAndUpdate(
        req.params.postID,
        {
          $addToSet: { likes: req.user.id },
        },
        { new: true }
      );
    } else {
      // remove the specific userid from likes
      post = await Post.findByIdAndUpdate(
        req.params.postID,
        {
          $pull: { likes: req.user.id },
        },
        { new: true }
      );
    }
    return res.json(post.likes.length);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(error);
  }
});

// *** non-locking version *** //
// router.put('/:postID/like', auth, async (req,res) =>{
//   try {
//     const post = await Post.findById(req.params.postID);
//     if(!post)  {
//       return res.status(404).json({ msg: 'Post Not Found' });
//     }
//     const like = req.body.like;
//     if(like) {
//        post.likes.push(req.user.id);
//     } else {
//       const index = post.likes.indexOf(req.user.id);
//       post.likes.splice(index, 1);
//     }
//     post.save();
//     res.json(post.likes.length);
//   } catch (error) {
//     console.error(error);
//       res.status(500).json(error);
//   }
// })

//route api/posts/comments
// app.use('/comments')

module.exports = router;
