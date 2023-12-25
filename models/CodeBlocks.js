const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema({
  title: String,
  code: String,
  question:String,
  solution:String,
  isMentor:Boolean,
  connections:Number,
});

module.exports = mongoose.model('CodeBlock', codeBlockSchema);