

```markdown
# AI Usage Documentation

## 1. AI Tools Used

- OpenAI ChatGPT (GPT-5 Mini) for debugging guidance.

---

## 2. Prompts Given
- "Provide Postman examples for testing APIs."
- "Fix Mongoose ObjectId and string mismatch issues."

---

## 3. Modifications from AI Output

- Changed `_id` in schemas from `ObjectId` to `String` for easier testing with custom IDs.
- Updated `ConversationHistory` to handle string `_id`s instead of `ObjectId`.
- Added defensive checks for null values to avoid runtime errors.
- Adjusted `goBack` logic to correctly pop the stack and return the previous question.
- Refined API routes to match assignment instructions.

---

## 4. What AI Got Wrong

- Initially suggested using `ObjectId` for `_id` fields, which conflicted with string IDs in sample data.
- AI did not fully handle the checkpoint logic for resetting module stacks.
- Some responses lacked error handling for edge cases like stale questions or broken flows.

---
