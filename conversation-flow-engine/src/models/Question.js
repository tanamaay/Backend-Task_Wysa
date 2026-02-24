const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  _id: String,
  text: String,
  nextQuestionId: { type: String, ref: 'Question' },
  nextModuleId: { type: String, ref: 'Module' }      
});

const questionSchema = new mongoose.Schema({
  _id: String,
  text: { type: String, required: true },
  moduleId: { type: String, ref: 'Module' }, 
  options: [optionSchema],
  isCheckpoint: { type: Boolean, default: false }
});

module.exports = mongoose.model('Question', questionSchema);