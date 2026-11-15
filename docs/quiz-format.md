# Quiz JSON Format Guide

This document explains how to create valid JSON files for Infinity Quiz quizzes.

---

## Basic Structure

A quiz is a JSON object with the following structure:

```json
{
  "id": "unique-quiz-id",
  "title": "Quiz Title",
  "description": "Quiz description",
  "questions": [
    {
      "id": "question-1",
      "text": "Question text?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswerIndex": 0
    }
  ]
}
```

---

## Quiz Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the quiz |
| `title` | string | Yes | Display title of the quiz |
| `description` | string | Yes | Description shown to users |
| `questions` | array | Yes | Array of question objects |
| `timeLimit` | number | No | Total time limit in seconds for the entire quiz |
| `shuffleQuestions` | boolean | No | Whether to shuffle question order (default: false) |
| `shuffleAnswers` | boolean | No | Whether to shuffle answers for ALL questions (default: false) |
| `maxSkips` | number | No | Maximum questions user can skip (undefined = unlimited) |
| `enableReviewMode` | boolean | No | Allow reviewing answers after completion (default: false) |
| `feedbackEnabled` | boolean | No | Show immediate feedback after each answer (default: false) |

---

## Question Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the question |
| `text` | string | Yes | The question text |
| `options` | string[] | Yes | Array of answer options (2-4 recommended) |
| `correctAnswerIndex` | number | Yes | Index of the correct answer in `options` array (0-based) |
| `timeLimit` | number | No | Time limit in seconds for this specific question |
| `shuffleAnswers` | boolean | No | Override global `shuffleAnswers` for this question only |
| `explanation` | string | No | Explanation shown when feedback is enabled |

---

## Complete Example

```json
{
  "id": "sample-quiz-1",
  "title": "World Capitals",
  "description": "Test your knowledge of world capitals",
  "timeLimit": 120,
  "shuffleQuestions": true,
  "shuffleAnswers": true,
  "maxSkips": 2,
  "enableReviewMode": true,
  "feedbackEnabled": true,
  "questions": [
    {
      "id": "q1",
      "text": "What is the capital of France?",
      "options": ["London", "Paris", "Berlin", "Madrid"],
      "correctAnswerIndex": 1,
      "explanation": "Paris has been the capital of France since the 10th century."
    },
    {
      "id": "q2",
      "text": "What is the capital of Japan?",
      "options": ["Beijing", "Tokyo", "Seoul", "Bangkok"],
      "correctAnswerIndex": 1,
      "timeLimit": 10,
      "shuffleAnswers": false
    }
  ]
}
```

---

## JSON Array Format

To create multiple quizzes, use an array of quiz objects:

```json
[
  {
    "id": "quiz-1",
    "title": "First Quiz",
    "description": "Description here",
    "questions": [...]
  },
  {
    "id": "quiz-2",
    "title": "Second Quiz",
    "description": "Another description",
    "questions": [...]
  }
]
```

---

## Validation Rules

1. **Required Fields**: Every quiz must have `id`, `title`, `description`, and `questions`.
2. **Unique IDs**: All quiz IDs and question IDs must be unique.
3. **Options Array**: Each question must have at least 2 options.
4. **Correct Answer Index**: Must be a valid index in the `options` array (0 to options.length-1).
5. **Time Limits**: Must be positive numbers if provided.
6. **JSON Syntax**: Must be valid JSON (double quotes, no trailing commas, etc.)

---

## Common Errors to Avoid

### Invalid JSON Syntax
```json
// WRONG - single quotes and trailing comma
{
  'id': 'quiz-1',
  'title': 'Test',
  'questions': [],
}

// RIGHT - double quotes, no trailing comma
{
  "id": "quiz-1",
  "title": "Test",
  "questions": []
}
```

### Invalid correctAnswerIndex
```json
// WRONG - index out of range
{
  "options": ["A", "B", "C"],
  "correctAnswerIndex": 3
}

// RIGHT - valid index
{
  "options": ["A", "B", "C"],
  "correctAnswerIndex": 1
}
```

### Duplicate IDs
```json
// WRONG - duplicate question IDs
{
  "questions": [
    {"id": "q1", "text": "Q1", "options": [...], "correctAnswerIndex": 0},
    {"id": "q1", "text": "Q2", "options": [...], "correctAnswerIndex": 1}
  ]
}

// RIGHT - unique IDs
{
  "questions": [
    {"id": "q1", "text": "Q1", "options": [...], "correctAnswerIndex": 0},
    {"id": "q2", "text": "Q2", "options": [...], "correctAnswerIndex": 1}
  ]
}
```

---

## Behavior Notes

- If `shuffleAnswers` is `true` at the quiz level, ALL questions will have shuffled answers unless overridden per question.
- If a question has its own `shuffleAnswers` property, it overrides the quiz-level setting.
- If `feedbackEnabled` is `true`, questions with `explanation` will show it after answering. It's recommended to provide explanations for all questions when feedback is enabled.
- If both quiz-level `timeLimit` and question-level `timeLimit` are set, the question-level limit takes precedence.
- `maxSkips` of `undefined` or not specified means unlimited skips.

---

## Quick Start Template

Copy and modify this template:

```json
{
  "id": "my-quiz",
  "title": "My Quiz Title",
  "description": "My quiz description",
  "questions": [
    {
      "id": "q1",
      "text": "First question?",
      "options": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
      "correctAnswerIndex": 0
    }
  ]
}
```
