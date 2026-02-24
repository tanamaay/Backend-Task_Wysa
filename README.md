# Modular Conversation Flow Backend

This project implements a **backend service** that powers a modular conversation flow system for users. The system allows users to progress through multiple modules, answer questions, and maintain conversation history while handling edge cases defensively.

---

## Table of Contents

- [Objective](#objective)  
- [Features](#features)  
- [Folder Structure](#folder-structure)  
- [API Design](#api-design)  
- [Data Models](#data-models)  
- [Setup Instructions](#setup-instructions)  
- [Usage](#usage)  
- [AI Usage](#ai-usage)  

---

## Objective

The backend system is designed to:

- Support multiple **modules**, each containing questions.  
- Allow users to **move through questions** using options.  
- Handle **module switching** and **deep link recovery**.  
- Maintain **conversation history** and **current module state**.  
- Implement **checkpoints** that reset context for a module while preserving history.  
- Defensively handle **invalid flows**, broken references, or repeated module visits.  
- Optionally allow users to go **back to the previous question** (bonus feature).

---

## Features

1. Start a module and answer questions.
2. Navigate within a module or switch to another module based on options.
3. Maintain:
   - Complete conversation history.
   - Active state within the current module.
4. Handle **checkpoints** for resetting context.
5. Recover from old deep links or notifications to return the **latest valid question**.
6. Defensive handling:
   - Invalid option selections.
   - Broken question references.
   - Repeated module switching.
7. (Bonus) Go back to the previous question in the current module.

---

## Folder Structure

modular-conversation-backend/
│
├─ src/
│ ├─ controllers/ # Route handlers for modules, questions, users
│ ├─ models/ # Data models for User, Module, Question, Option
│ ├─ routes/ # API route definitions
│ ├─ services/ # Business logic and conversation flow handling
│ ├─ errormdileware/ # Helper functions (e.g., validation, error handling)
│ └─ app.js # Express server setup
│
├─ AI_USAGE.md # Documentation for AI usage during development
├─ package.json # Node.js dependencies and scripts
├─ .env # Environment variables
└─ README.md # Project documentation



---

## API Design

### Start a Module
**POST** `/api/module/:moduleId/start`  
**Request Body:**  
```json
{
  "userId": "user123"
}

Response:

{
  "currentQuestion": {
    "_id": "question1",
    "text": "Welcome to Engineering Basics! Ready to start?",
    "options": [...]
  }
}


Answer a Question

POST /api/question/:questionId/answer
Request Body:

{
  "userId": "user123",
  "optionId": "option1"
}

Response:
{
  "nextQuestion": {
    "_id": "question2",
    "text": "Which branch are you most interested in?",
    "options": [...]
  },
  "moduleState": {
    "currentModule": "module1",
    "checkpointReached": false
  },
  "conversationHistory": [...]
}


Get Current Question (Deep Link Recovery)

GET /api/user/:userId/current-question
Response:

{
  "currentQuestion": { ... },
  "moduleState": { ... },
  "conversationHistory": [ ... ]
}

Data Models
Module
{
  "_id": "module1",
  "name": "Engineering Basics",
  "startQuestionId": "question1"
}

Question
{
  "_id": "question1",
  "moduleId": "module1",
  "text": "Welcome to Engineering Basics! Ready to start?",
  "isCheckpoint": false,
  "options": [
    { "_id": "option1", "text": "Yes", "nextQuestionId": "question2" },
    { "_id": "option2", "text": "No", "nextQuestionId": "question5" }
  ]
}

User State
{
  "_id": "user123",
  "currentModule": "module1",
  "currentQuestion": "question2",
  "conversationHistory": [
    { "questionId": "question1", "optionId": "option1" }
  ]
}


Setup Instructions

1. Clone the repository:

git clone https://github.com/<your-username>/modular-conversation-backend.git
cd modular-conversation-backend

2. Install dependencies:

npm install

3. Create .env file:

PORT=5000
DB_URI=mongodb://localhost:27017/conversationDB

4. Seed database (optional):

npm run seed

5. Start the server:

npm run dev

6. Run tests:

npm test
Usage

Start a module for a user.

Answer questions sequentially or switch modules via options.

Retrieve current question at any time to handle old links or notifications.

View conversation history for analytics or resuming sessions.
