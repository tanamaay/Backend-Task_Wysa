const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  _id: String,                     // option ID as string
  text: { type: String, required: true },
  nextQuestionId: { type: String, ref: 'Question', default: null }, // string reference
  nextModuleId: { type: String, ref: 'Module', default: null }      // string reference
});

const questionSchema = new mongoose.Schema({
  _id: String,                     // question ID as string
  text: { type: String, required: true },
  moduleId: { type: String, ref: 'Module', required: true }, // string reference
  options: [optionSchema],
  isCheckpoint: { type: Boolean, default: false }
});

module.exports = mongoose.model('Question', questionSchema);