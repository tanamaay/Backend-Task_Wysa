const mongoose = require('mongoose');

const conversationHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  moduleId: { type: String, ref: 'Module' },
  questionId: { type: String, ref: 'Question' },
  selectedOptionId: { type: String },

  contextVersion: { 
    type: Number, 
    required: true ,
    default: 1
  }

}, { timestamps: true });

module.exports = mongoose.model('ConversationHistory', conversationHistorySchema);