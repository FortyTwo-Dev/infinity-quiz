# Roadmap

## Overview
Infinity Quiz is a local-first quiz application built with Vue 3. The goal is to start with a simple, functional quiz app and iteratively add features while maintaining a clean, maintainable codebase.

---

## Phase 1: MVP - Core Quiz Functionality (Local Only)

### Objective
Create a minimal working quiz app that runs locally with basic question/answer flow.

### Features
- [x] **Quiz List**: Display a list of available quizzes (stored locally)
- [x] **Quiz Selection**: User can select a quiz from the list
- [x] **Question Display**: Show one question at a time with multiple choice answers
- [x] **Answer Selection**: User can select an answer
- [x] **Navigation**: Next/Previous buttons to move between questions
- [x] **Score Calculation**: Track correct/incorrect answers
- [x] **Results Screen**: Show final score at the end of the quiz
- [x] **Restart Quiz**: Ability to restart the same quiz
- [x] **Back to Quiz List**: Return to quiz selection after completion

### Data Structure
```typescript
// Quiz
{ id: string, title: string, description: string, questions: Question[] }

// Question
{ id: string, text: string, options: string[], correctAnswerIndex: number }
```

### Storage
- Use `pinia-plugin-persistedstate` to persist quizzes and user progress in localStorage
- No backend or database required for this phase

---

## Phase 2: Enhanced Quiz Experience

### Features
- [x] **Timer**: Optional time limit per quiz
- [x] **Progress Bar**: Visual indicator of quiz completion percentage
- [x] **Question Shuffling**: Randomize question order
- [x] **Answer Shuffling**: Randomize answer order for each question
- [x] **Skip Question**: Allow users to skip and return later
- [ ] **Review Mode**: Review all questions and answers at the end
- [ ] **Correct Answer Highlight**: Show correct answer after selection
- [ ] **Feedback**: Immediate feedback on answer selection

---

## Phase 3: Quiz Management

### Features
- [ ] **Create Quiz**: Form to create new quizzes
- [ ] **Edit Quiz**: Modify existing quizzes
- [ ] **Delete Quiz**: Remove quizzes
- [ ] **Duplicate Quiz**: Copy existing quiz for modification
- [ ] **Quiz Categories**: Organize quizzes by category/tags
- [ ] **Search Quizzes**: Filter quizzes by title or category
- [ ] **Import/Export**: JSON import/export for sharing quizzes

---

## Phase 4: Advanced Features

### Features
- [ ] **Difficulty Levels**: Easy/Medium/Hard questions
- [ ] **Question Types**: Support for true/false, multiple correct answers, open-ended
- [ ] **Hints**: Optional hints for questions
- [ ] **Explanations**: Show explanation after answering
- [ ] **Image Support**: Add images to questions
- [ ] **Markdown Support**: Rich text formatting for questions and answers
- [ ] **Custom Themes**: Light/dark mode and color customization

---

## Phase 5: Statistics & Progress Tracking

### Features
- [ ] **User Profiles**: Local user profiles (stored in localStorage)
- [ ] **Quiz History**: Track completed quizzes, scores, and dates
- [ ] **Statistics Dashboard**: Visual charts of performance over time
- [ ] **Per-Quiz Stats**: Average score, completion time, best score
- [ ] **Category Stats**: Performance breakdown by category
- [ ] **Streaks**: Track daily quiz completion streaks
- [ ] **Achievements**: Unlock achievements based on milestones

---

## Phase 6: Multiplayer & Social (Future)

### Features
- [ ] **Local Multiplayer**: Hot-seat mode for multiple players on one device
- [ ] **Score Comparison**: Compare scores with other local players
- [ ] **Leaderboard**: Local high scores table
- [ ] **PWA**: Installable Progressive Web App
- [ ] **Offline Support**: Full functionality without internet connection

---

## Technical Milestones

| Milestone | Description | Dependencies |
|-----------|-------------|--------------|
| M1 | Setup project structure with Vue 3, Pinia, Vue Router | Bun, Vite |
| M2 | Implement basic store with persisted state | pinia-plugin-persistedstate |
| M3 | Create quiz data model and sample data | - |
| M4 | Build quiz list and selection UI | Vue Router |
| M5 | Implement quiz taking flow | Pinia |
| M6 | Add scoring and results | - |
| M7 | Implement timer and progress tracking | - |
| M8 | Build quiz creation/editing interface | - |
| M9 | Add statistics and history tracking | Pinia persistence |
| M10 | Add advanced question types | - |

---

## Priority Order
1. Phase 1 (MVP) - **Highest Priority**
2. Phase 2 (Enhanced Experience)
3. Phase 3 (Quiz Management)
4. Phase 5 (Statistics)
5. Phase 4 (Advanced Features)
6. Phase 6 (Multiplayer)

---

## Notes
- All data will be stored locally using localStorage via pinia-plugin-persistedstate
- No authentication or backend services required for initial versions
- Focus on clean, modular code with proper TypeScript types
- Each feature should be tested before merging
