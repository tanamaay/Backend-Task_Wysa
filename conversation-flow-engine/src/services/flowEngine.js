const Module = require('../models/Module');
const Question = require('../models/Question');
const UserConversation = require('../models/UserConversation');
const ConversationHistory = require('../models/ConversationHistory');

/**
 * Start a module for the user
 */
async function startModule(userId, moduleId) {
  const module = await Module.findById(moduleId);
  if (!module) throw new Error("Module not found");

  const question = await Question.findById(module.startQuestionId);
  if (!question) throw new Error("Start question not found");

  let userState = await UserConversation.findOne({ userId });
  if (!userState) {
    userState = new UserConversation({ userId, moduleStates: new Map(), moduleContextVersions: new Map() });
  }

  userState.currentModuleId = moduleId;
  userState.currentQuestionId = question._id;

  // Initialize module state
  userState.moduleStates.set(moduleId.toString(), {
    stack: [question._id],
    lastCheckpointQuestionId: null
  });

  // Initialize module context version
  userState.moduleContextVersions.set(moduleId.toString(), 1);

  await userState.save();
  return question;
}

/**
 * Answer a question
 */
async function answerQuestion(userId, questionId, optionId) {
  const userState = await UserConversation.findOne({ userId });
  if (!userState) throw new Error("User state not found");

  // Check for stale question
  if (userState.currentQuestionId !== questionId && userState.currentQuestionId?.toString() !== questionId)
    throw new Error("Stale question");

  const question = await Question.findById(questionId);
  if (!question) throw new Error("Question not found");

  const option = question.options.id(optionId);
  if (!option) throw new Error("Invalid option");

  const moduleIdStr = question.moduleId.toString();
  let currentVersion = userState.moduleContextVersions.get(moduleIdStr) || 1;

  // Save conversation history
  await ConversationHistory.create({
    userId,
    moduleId: question.moduleId,
    questionId,
    selectedOptionId: optionId,
    contextVersion: currentVersion
  });

  // Handle module switch
  if (option.nextModuleId) {
    return startModule(userId, option.nextModuleId);
  }

  // Handle next question in same module
  if (option.nextQuestionId) {
    const nextQuestion = await Question.findById(option.nextQuestionId);
    if (!nextQuestion) throw new Error("Broken flow");

    const moduleState = userState.moduleStates.get(moduleIdStr);

    if (nextQuestion.isCheckpoint) {
      moduleState.stack = [nextQuestion._id];
      moduleState.lastCheckpointQuestionId = nextQuestion._id;
      userState.moduleContextVersions.set(moduleIdStr, currentVersion + 1);
    } else {
      moduleState.stack.push(nextQuestion._id);
    }

    userState.currentQuestionId = nextQuestion._id;
    await userState.save();
    return nextQuestion;
  }

  // End of flow
  userState.currentQuestionId = null;
  await userState.save();
  return null;
}

/**
 * Get current question for the user
 */
async function getCurrentQuestion(userId) {
  const userState = await UserConversation.findOne({ userId });
  if (!userState) throw new Error("User state not found");

  if (!userState.currentQuestionId) return null;
  return Question.findById(userState.currentQuestionId);
}

/**
 * Handle deep link validation
 */
async function handleDeepLink(userId, questionId) {
  const userState = await UserConversation.findOne({ userId });
  if (!userState) throw new Error("User state not found");

  const question = await Question.findById(questionId);
  if (!question) throw new Error("Question not found");

  const moduleIdStr = question.moduleId.toString();
  let moduleState = userState.moduleStates[moduleIdStr];

  if (!moduleState) {
    moduleState = { stack: [], lastCheckpointQuestionId: null };
    userState.moduleStates[moduleIdStr] = moduleState;
  }

  if (moduleState.stack.includes(questionId)) return question;

  if (moduleState.stack.length > 0) {
    const lastQId = moduleState.stack[moduleState.stack.length - 1];
    return await Question.findById(lastQId);
  }

  const firstQuestion = await Question.findOne({ moduleId: moduleIdStr }).sort({ _id: 1 });
  return firstQuestion;
}

/**
 * Go back one question
 */
async function goBack(userId) {
  const userState = await UserConversation.findOne({ userId });
  if (!userState) throw new Error("User state not found");

  const moduleState = userState.moduleStates.get(userState.currentModuleId.toString());
  if (!moduleState || moduleState.stack.length === 0) throw new Error("No questions in this module");

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