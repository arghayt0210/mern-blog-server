const mongoose = require("mongoose");

// Schema
const profanitySchema = new mongoose.Schema({
  bannedWords: [String],
});

// Model
const Profanity = mongoose.model("Profanity", profanitySchema);

module.exports = Profanity;
