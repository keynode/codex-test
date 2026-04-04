# Product Spec — Food Quest CN

## 1. Product Overview
**Food Quest CN** is a browser-based micro-learning product for children (up to ~9 years old) to learn beginner Chinese food vocabulary through short interactive activities.

The product is intentionally lightweight (HTML/CSS/JS, no backend required) so it can run locally/offline and be iterated quickly.

---

## 2. Product Goals
1. Teach children a small set of Chinese words on the topic **Food**.
2. Reinforce memory through two game loops:
   - multiple-choice translation,
   - sentence completion with blanks.
3. Keep engagement high with immediate feedback and rewards.
4. Make progress visible and motivating from start to finish.

---

## 3. Target Audience
- **Primary users:** children aged 6–9.
- **Secondary users:** parents/tutors supervising sessions.

Design assumptions:
- short attention span,
- low reading load,
- strong preference for visual/interactive learning.

---

## 4. Lesson Scope (Current MVP)
Single lesson: **Food vocabulary**.

### Included words
- 米饭 (mǐfàn) — рис
- 面条 (miàntiáo) — лапша
- 苹果 (píngguǒ) — яблоко
- 水 (shuǐ) — вода
- 牛奶 (niúnǎi) — молоко
- 包子 (bāozi) — баоцзы

### Included sentence tasks
- 1 blank: 我吃___。
- 2 blanks: 我喝___和___。
- 3 blanks: 今天我吃___，喝___，还有___。

---

## 5. Core User Flow
1. **Start screen** → “Начать приключение”.
2. **Words screen** → explore vocabulary cards and listen to pronunciation.
3. **Quiz screen** → select 1 correct translation out of 3 options for each word.
4. **Fill screen** → fill sentence blanks (1/2/3 words) from dropdown choices.
5. **Result screen** → view stars, badges, and completion result.
6. Optional restart via “Играть снова”.

---

## 6. Feature Specification

### 6.1 Lesson Map & Progress
- Left-side lesson map with 5 stages:
  1) Старт
  2) Слова дня
  3) Выбор перевода
  4) Вставь слова
  5) Финал
- Active step highlighting.
- Progress bar updates when stage changes.

### 6.2 Vocabulary Cards
- Grid of clickable cards.
- Each card contains:
  - emoji/icon cue,
  - Hanzi,
  - Pinyin,
  - Russian translation,
  - “tap to listen” behavior.
- Card click triggers Chinese TTS (`SpeechSynthesisUtterance`, `zh-CN`).

### 6.3 Multiple-Choice Quiz
- For each vocabulary item:
  - generate one question “Что означает … ?”
  - show 3 answer options (1 correct + 2 distractors).
- Option order randomized.
- Question order randomized.
- Feedback behavior:
  - correct: green state + star increment,
  - wrong: red state + show correct answer.
- Buttons disabled after selection; auto-advance to next question.

### 6.4 Fill-in-the-Blank Game
- Three sentence templates with 1, 2, and 3 blanks.
- Each blank is a dropdown selector with all lesson words.
- Validation checks each blank against expected answer.
- Shows total correct answers: `correct / total`.
- Correct blanks convert to reward stars (batch reward by count).

### 6.5 Reward System
- **Stars**: main score currency.
  - +1 for each correct quiz answer.
  - +N in fill task, where N = number of correctly filled blanks.
- **Badges/Stickers**:
  - Every time stars are divisible by 3, badge count +1.
  - Toast notification appears on badge unlock.

### 6.6 Result Summary
- Displays:
  - total stars,
  - total badges,
  - fill-task score,
  - adaptive encouragement message based on performance threshold.

### 6.7 Session Reset
- “Играть снова” resets:
  - stars,
  - badges,
  - quiz index/items,
  - feedback text,
  - screen to start.

---

## 7. UX/UI Specification

### Visual style
- Dark gradient background with decorative blur orbs.
- Glassmorphism panels for top bar, map, and stage container.
- High-contrast text and vivid status colors for correctness.

### Child-friendly interaction principles
- Large tappable controls.
- One primary action per stage.
- Immediate feedback after each choice.
- Progress always visible.
- Lightweight celebratory effects (toast rewards).

### Responsive behavior
- Desktop/tablet: two-column layout (map + stage content).
- Mobile: collapses to single-column.

---

## 8. Technical Specification

### Stack
- `index.html` — structure and screen containers.
- `styles.css` — theme tokens, responsive layout, components.
- `app.js` — data, state, rendering, interactions, scoring.

### State model (client-side)
- `stars`, `badges`
- `quizIndex`, `quizItems`
- active stage key (`start|words|quiz|fill|result`)

### Main logic modules
- Screen/state transitions: `showScreen`, `setStep`
- Rewards: `addReward`
- Audio: `speak`
- Content renderers: `renderWords`, `renderQuizQuestion`, `renderFillTask`
- Validation: `checkFillAnswers`
- Session lifecycle: `resetLesson`

### Dependencies
- Browser Web Speech API for audio (degrades gracefully if unavailable).
- No external JS/CSS libraries.

---

## 9. Non-Functional Requirements
- Fast load, no build step.
- Works from static hosting or local filesystem.
- Minimal memory footprint.
- Readable codebase for educational iteration.

---

## 10. Success Criteria (Current Version)
1. Child can complete full lesson flow without assistance in ~5–10 minutes.
2. Child correctly answers at least 60% of quiz + fill interactions.
3. Reward loop triggers at least one badge in a normal run.
4. Parent can easily understand result summary.

---

## 11. Future Enhancements
1. Additional lesson packs (fruits, drinks, meals).
2. True drag-and-drop blanks for tactile interaction.
3. Audio for full example sentences.
4. Parent dashboard with per-word mastery history.
5. Optional backend for persistent profiles and streaks.
6. Accessibility pass (keyboard flow, ARIA, dyslexia-friendly font mode).
7. Telemetry hooks for drop-off and item difficulty analytics.
