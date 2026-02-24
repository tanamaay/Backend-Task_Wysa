const mongoose = require('mongoose');

const userConversationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  currentModuleId: { type: String, ref: 'Module' }, 
  currentQuestionId: { type: String, ref: 'Question' },
  moduleStates: {
    type: Map,
    of: new mongoose.Schema({
      stack: [{ type: String, ref: 'Question' }],
      lastCheckpointQuestionId: { type: String, ref: 'Question' }
    }),
    default: {}  
  }
});

module.exports = mongoose.model('UserConversation', userConversationSchema);