const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
// route source |server.js|posts.js|comments.js
// @route		POST api/posts/comments/:postID
// @desc		create a new comment for the given post
// @access	private
router.post("/:postID", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({ msg: "Profile required" });
    }
    const comment = { text: req.body.text, profile: profile.id };
    const post = await Post.findByIdAndUpdate(
      req.params.postID,
      { $push: { comments: comment } },
      { new: true }
    );

    return res.json(post.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
// *** NonLocking Method *** ///
/*
    const post = await Post.findById(req.params.postID);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({ msg: "Profile required" });
    }
    const comment = { text: req.body.text, profile: profile.id };

    post.comments.push(comment);
    post.save();
    res.json(post.comments);
*/

// @route		DELETE api/posts/comments/:postID/:commentID
// @desc		find and delete a specific comment from a post
// @access	owner

router.delete("/:postID/:commentID", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postID);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.commentID
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    const profile = await Profile.findOne({ user: req.user.id });

    if (profile.id !== post.comments[index].profile) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.postID, {
      $pull: { comments: { id: req.params.id, profile: profile.id } },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
// epic: find and remove from a posts comments array the specific comment and return the new comment array.

// check logged in
// get the comment
// check if user is owner of comment
// delete the comment
// return comment array to requester.
