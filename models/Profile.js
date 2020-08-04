const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
    },
    educationLevel: {
      type: String,
      enum: [
        "Some Home School",
        "High School",
        "GED",
        "Some College",
        "College",
        "Masters",
        "PHD",
        "Technical School",
        "BootCamp",
      ],
      required: true,
    },
    // resourceId: {
    //   type: [Schema.Types.ObjectId],
    //   ref: "posts",
    // },
    certifications: [String],
    location: {
      city: String,
      state: String,
    },
    social: {
      githubUrl: String,
      twitterUrl: String,
      youtubeUrl: String,
    },
    summary: String,
    Avatar: String,
  },
  { timestamps: {} }
);

module.exports = Profile = mongoose.model("profiles", profileSchema);
