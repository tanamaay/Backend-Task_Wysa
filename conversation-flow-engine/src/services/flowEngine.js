const Module = require('../models/Module');
const Question = require('../models/Question');
const UserConversation = require('../models/UserConversation');
const ConversationHistory = require('../models/ConversationHistory');

async function startModule(userId, moduleId) {
  const module = await Module.findById(moduleId);
  if (!module) throw new Error("Module not found");

  const question = await Question.findById(module.startQuestionId);

  let userState = await UserConversation.findOne({ userId });
  if (!userState) userState = new UserConversation({ userId });

  userState.currentModuleId = moduleId;
  userState.currentQuestionId = question._id;
  userState.moduleStates.set(moduleId.toString(), {
    stack: [question._id],
    lastCheckpointQuestionId: null
  });

  await userState.save();
  return question;
}

async function answerQuestion(userId, questionId, optionId) {
  const userState = await UserConversation.findOne({ userId });
  if (!userState) throw new Error("User state not found");
  if (userState.currentQuestionId.toString() !== questionId) throw new Error("Stale question");

  const question = await Question.findById(questionId);
  const option = question.options.id(optionId);
  if (!option) throw new Error("Invalid option");

  await ConversationHistory.create({
    userId,
    moduleId: question.moduleId,
    questionId,
    selectedOptionId: optionId
  });

  if (option.nextModuleId) return startModule(userId, option.nextModuleId);

  const nextQuestion = await Question.findById(option.nextQuestionId);
  if (!nextQuestion) throw new Error("Broken flow");

  const moduleState = userState.moduleStates.get(question.moduleId.toString());
  if (nextQuestion.isCheckpoint) {
    moduleState.stack = [nextQuestion._id];
    moduleState.lastCheckpointQuestionId = nextQuestion._id;
  } else {
    moduleState.stack.push(nextQuestion._id);
  }

  userState.currentQuestionId = nextQuestion._id;
  await userState.save();

  return nextQuestion;
}

async function getCurrentQuestion(userId) {
  const userState = await UserConversation.findOne({ userId });
  if (!userState) throw new Error("User state not found");
  return Question.findById(userState.currentQuestionId);
}

async function handleDeepLink(userId, questionId) {
  const userState = await UserConversation.findOne({ userId });
  if (!userState) throw new Error("User state not found");

  const moduleState = userState.moduleStates.get(userState.currentModuleId.toString());
  if (moduleState && moduleState.stack.includes(questionId)) return Question.findById(questionId);

  return Question.findById(userState.currentQuestionId);
}

async function goBack(userId) {
    const userState = await UserConversation.findOne({ userId });
    if (!userState) throw new Error("User state not found");
  
    const moduleState = userState.moduleStates.get(userState.currentModuleId.toString());
    if (!moduleState || moduleState.stack.length === 0) throw new Error("No questions in this module");
  
    // If only one question, return it instead of error
    if (moduleState.stack.length === 1) {
      const firstQuestion = moduleState.stack[0];
      userState.currentQuestionId = firstQuestion;
      await userState.save();
      return await Question.findById(firstQuestion);
    }
  
    // Pop last question to go back
    moduleState.stack.pop();
    const previous = moduleState.stack[moduleState.stack.length - 1];
  
    userState.currentQuestionId = previous;
    await userState.save();
  
    return await Question.findById(previous);
  }

module.exports = {
  startModule,
  answerQuestion,
  getCurrentQuestion,
  handleDeepLink,
  goBack
};