const flowEngine = require('../services/flowEngine');

exports.startModule = async (req, res, next) => {
  try {
    const question = await flowEngine.startModule(req.body.userId, req.params.moduleId);
    res.json(question);
  } catch (err) {
    next(err);
  }
};

exports.answerQuestion = async (req, res, next) => {
  try {
    const question = await flowEngine.answerQuestion(req.body.userId, req.params.questionId, req.body.optionId);
    res.json(question);
  } catch (err) {
    next(err);
  }
};

exports.getCurrentQuestion = async (req, res, next) => {
  try {
    const question = await flowEngine.getCurrentQuestion(req.params.userId);
    res.json(question);
  } catch (err) {
    next(err);
  }
};

exports.handleDeepLink = async (req, res, next) => {
  try {
    const question = await flowEngine.handleDeepLink(req.query.userId, req.params.questionId);
    res.json(question);
  } catch (err) {
    next(err);
  }
};

exports.goBack = async (req, res, next) => {
  try {
    const question = await flowEngine.goBack(req.params.userId);
    res.json(question);
  } catch (err) {
    next(err);
  }
};