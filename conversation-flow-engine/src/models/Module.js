const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  _id: String,                   // module ID as string
  name: { type: String, required: true },
  startQuestionId: { type: String, ref: 'Question', required: true } // string reference
});

module.exports = mongoose.model('Module', moduleSchema);