# Conversation Flow Engine

## Backend Engineer (Junior) — Take Home Assignment

This project implements a backend service that powers a modular conversation flow system. Users can start modules, answer questions, navigate checkpoints, and switch modules.

---

## Features

- Start a module and answer questions sequentially.
- Options may move the user to a different question or module.
- Checkpoints reset the module stack without deleting conversation history.
- Track user state and complete conversation history.
- Defensive handling of invalid flows and errors.
- Bonus: Go back to previous question within current module state.

---

## Features

- Start a module and answer questions sequentially.
- Options may move the user to a different question or module.
- Checkpoints reset the module stack without deleting conversation history.
- Track user state and complete conversation history.
- Defensive handling of invalid flows and errors.
- Bonus: Go back to previous question within current module state.

---

## Folder Structure

conversation-flow-engine/
│
├─ src/
│ ├─ controllers/
│ │ └─ flowController.js
│ ├─ models/
│ │ ├─ Module.js
│ │ ├─ Question.js
│ │ ├─ UserConversation.js
│ │ └─ ConversationHistory.js
│ ├─ routes/
│ │ └─ flowRoutes.js
│ └─ services/
│ └─ flowEngine.js
│
├─ package.json
├─ server.js
└─ README.md


---

## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd conversation-flow-engine

2. Install dependencies
npm install


3. Setup MongoDB Atlas

Create a cluster on MongoDB Atlas.
Create a database, e.g., conversationFlow.
Create collections: modules, questions, userconversations, conversationhistories.
Copy your connection string.


4. Environment Variables

Create a .env file:
PORT=5000
MONGO_URI=<your-mongodb-connection-string>


5. Run the Server

npm run dev

Server will run on the http://localhost:5000


6. API Endpoints

| Method | Endpoint                          | Body / Params                                  | Purpose                      |
| ------ | --------------------------------- | ---------------------------------------------- | ---------------------------- |
| POST   | /api/modules/:moduleId/start      | `{ "userId": "user1" }`                        | Start a module               |
| POST   | /api/questions/:questionId/answer | `{ "userId": "user1", "optionId": "option1" }` | Answer a question            |
| GET    | /api/users/:userId/current        | Params: `userId`                               | Get active question          |
| GET    | /api/questions/:questionId        | Params: `questionId`                           | Deep link validation         |
| POST   | /api/users/:userId/back           | `{ "userId": "user1" }`                        | Go back to previous question |
