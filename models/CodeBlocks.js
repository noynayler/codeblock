const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema({
  title: String,
  code: String,
  question:String,
  solution:String,
});

module.exports = mongoose.model('CodeBlock', codeBlockSchema);