const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
    posterName: "Joel",
    resourceAuthor: "Traversy Media",
    authorSkillLevel: "Advance",
    cohort: "8",
    title: "React JS Crash Crourse",
    categories: ["React"],
    summary: "Code along about React on youtube",
    link: "https://www.youtube.com/watch?v=sBws8MSXN7A",
    resourceType: "Crash Course",
    datePublished: "2018-09-10.00:00:00.000z",
    videoLength: null,
    timeToComplete: 180,
    rating: 5,
    comments: [
      { user: "john", text: "Great video with clear instructions" },
      { user: "Bella", text: "Simple and straight to the point." },
    ],
*/

const commentSchema = new Schema(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: "profiles",
    },
    text: String,
    // TODO likes maybe dislikes too
  },
  { timestamps: {} }
);

const postSchema = new Schema({
  poster: {
    type: Schema.Types.ObjectId,
    ref: "profiles",
  },
  author: String,
  skillLevel: {
    type: String,
    enum: [
      "Beginner",
      "Intermediate",
      "Advanced",
      "Associate",
      "Junior",
      "Senior",
      "Lead",
    ],
  },
  cohort: String,
  title: String,
  categories: { type: [String], default: [] },
  summary: String,
  link: String,
  resourceType: {
    type: "String",
    enum: [
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
    ],
  },
  publishedAt: Date,
  videoLength: Number,
  timeToComplete: Number,
  comments: { type: [commentSchema], default: [] },
  // TODO raiting
});

module.exports = Post = mongoose.model("posts", postSchema);
