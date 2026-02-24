const mongoose = require('mongoose');

const conversationHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  moduleId: { type: String, ref: 'Module' },
  questionId: { type: String, ref: 'Question' },
  selectedOptionId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ConversationHistory', conversationHistorySchema);