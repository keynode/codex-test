const vocabulary = [
  { hanzi: "米饭", pinyin: "mǐfàn", translation: "рис", emoji: "🍚" },
  { hanzi: "面条", pinyin: "miàntiáo", translation: "лапша", emoji: "🍜" },
  { hanzi: "苹果", pinyin: "píngguǒ", translation: "яблоко", emoji: "🍎" },
  { hanzi: "水", pinyin: "shuǐ", translation: "вода", emoji: "💧" },
  { hanzi: "牛奶", pinyin: "niúnǎi", translation: "молоко", emoji: "🥛" },
  { hanzi: "包子", pinyin: "bāozi", translation: "баоцзы", emoji: "🥟" },
];

const fillTemplates = [
  {
    prompt: "我吃___。",
    answers: ["米饭"],
  },
  {
    prompt: "我喝___和___。",
    answers: ["水", "牛奶"],
  },
  {
    prompt: "今天我吃___，喝___，还有___。",
    answers: ["面条", "水", "苹果"],
  },
];

const stepOrder = ["start", "words", "fill", "result"];

const state = {
  stars: 0,
  badges: 0,
  activeStage: "start",
  fillScore: 0,
  fillTotal: fillTemplates.reduce((total, item) => total + item.answers.length, 0),
  fillChecked: false,
  fillSelections: fillTemplates.map((item) => item.answers.map(() => "")),
  fillFeedbackMessage: "",
  fillFeedbackType: "",
};

const elements = {
  stepList: document.getElementById("stepList"),
  progressFill: document.getElementById("progressFill"),
  progressLabel: document.getElementById("progressLabel"),
  starsCount: document.getElementById("starsCount"),
  badgesCount: document.getElementById("badgesCount"),
  wordGrid: document.getElementById("wordGrid"),
  fillList: document.getElementById("fillList"),
  fillFeedback: document.getElementById("fillFeedback"),
  resultStars: document.getElementById("resultStars"),
  resultBadges: document.getElementById("resultBadges"),
  resultFillScore: document.getElementById("resultFillScore"),
  resultMessage: document.getElementById("resultMessage"),
  badgeToast: document.getElementById("badgeToast"),
  screens: Array.from(document.querySelectorAll(".screen")),
  startBtn: document.getElementById("startBtn"),
  wordsNextBtn: document.getElementById("wordsNextBtn"),
  checkFillBtn: document.getElementById("checkFillBtn"),
  restartBtn: document.getElementById("restartBtn"),
  stepButtons: Array.from(document.querySelectorAll(".step-button")),
};

let toastTimeoutId = null;
let fillResultTimeoutId = null;

function setStep(stepKey) {
  state.activeStage = stepKey;
  const stepIndex = stepOrder.indexOf(stepKey);
  const progressPercent = Math.round((stepIndex / (stepOrder.length - 1)) * 100);

  elements.stepButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.step === stepKey);
  });

  elements.progressFill.style.width = `${progressPercent}%`;
  elements.progressLabel.textContent = `${progressPercent}%`;
}

function showScreen(screenKey) {
  setStep(screenKey);

  elements.screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === `screen-${screenKey}`);
  });
}

function clearPendingTransitions() {
  clearTimeout(fillResultTimeoutId);
}

function updateScoreboard() {
  elements.starsCount.textContent = String(state.stars);
  elements.badgesCount.textContent = String(state.badges);
}

function showToast(message) {
  clearTimeout(toastTimeoutId);
  elements.badgeToast.textContent = message;
  elements.badgeToast.classList.add("is-visible");

  toastTimeoutId = window.setTimeout(() => {
    elements.badgeToast.classList.remove("is-visible");
  }, 2200);
}

function addReward(amount) {
  if (amount <= 0) {
    return;
  }

  const previousBadges = state.badges;
  state.stars += amount;
  state.badges = Math.floor(state.stars / 3);
  updateScoreboard();

  if (state.badges > previousBadges) {
    showToast("Новая наклейка! Ты собрал ещё один значок.");
  }
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function renderWords() {
  elements.wordGrid.innerHTML = "";

  vocabulary.forEach((word) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "word-card";
    card.innerHTML = `
      <span class="emoji-badge">${word.emoji}</span>
      <span class="hanzi">${word.hanzi}</span>
      <span class="pinyin">${word.pinyin}</span>
      <span class="translation">${word.translation}</span>
      <span class="listen-hint">Нажми и послушай</span>
    `;
    card.addEventListener("click", () => speak(word.hanzi));
    elements.wordGrid.appendChild(card);
  });
}

function buildSelect(blankIndex, promptIndex) {
  const select = document.createElement("select");
  select.className = "fill-select";
  select.dataset.blankIndex = String(blankIndex);
  select.dataset.promptIndex = String(promptIndex);

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Выбери слово";
  select.appendChild(placeholder);

  vocabulary.forEach((word) => {
    const option = document.createElement("option");
    option.value = word.hanzi;
    option.textContent = `${word.emoji} ${word.hanzi} • ${word.translation}`;
    select.appendChild(option);
  });

  select.value = state.fillSelections[promptIndex][blankIndex];
  select.disabled = state.fillChecked;
  select.addEventListener("change", () => {
    state.fillSelections[promptIndex][blankIndex] = select.value;
  });

  return select;
}

function renderFillTask() {
  elements.fillList.innerHTML = "";
  elements.fillFeedback.textContent = state.fillFeedbackMessage;
  elements.fillFeedback.className = `feedback${
    state.fillFeedbackType ? ` ${state.fillFeedbackType}` : ""
  }`;
  elements.checkFillBtn.disabled = state.fillChecked;

  fillTemplates.forEach((template, promptIndex) => {
    const item = document.createElement("div");
    item.className = "fill-item";

    const label = document.createElement("p");
    label.textContent = `Фраза ${promptIndex + 1}`;

    const answerLine = document.createElement("div");
    answerLine.className = "fill-answer-line";

    const segments = template.prompt.split("___");

    segments.forEach((segment, segmentIndex) => {
      if (segment) {
        const text = document.createElement("span");
        text.className = "fill-sentence-text";
        text.textContent = segment;
        answerLine.appendChild(text);
      }

      if (segmentIndex < template.answers.length) {
        answerLine.appendChild(buildSelect(segmentIndex, promptIndex));
      }
    });

    item.append(label, answerLine);

    if (state.fillChecked) {
      const selectedValues = state.fillSelections[promptIndex];
      const expectedValues = fillTemplates[promptIndex].answers;
      const allCorrect = expectedValues.every((value, index) => value === selectedValues[index]);
      item.classList.add(allCorrect ? "success" : "error");
    }

    elements.fillList.appendChild(item);
  });
}

function checkFillAnswers() {
  if (state.fillChecked) {
    return;
  }

  let correctCount = 0;
  const fillItems = Array.from(elements.fillList.querySelectorAll(".fill-item"));

  fillItems.forEach((itemNode, promptIndex) => {
    const selectedValues = Array.from(itemNode.querySelectorAll("select")).map(
      (select) => select.value
    );
    const expectedValues = fillTemplates[promptIndex].answers;
    const allCorrect = expectedValues.every((value, index) => value === selectedValues[index]);

    correctCount += expectedValues.reduce((total, value, index) => {
      return total + Number(value === selectedValues[index]);
    }, 0);

    itemNode.classList.remove("success", "error");
    itemNode.classList.add(allCorrect ? "success" : "error");
  });

  state.fillChecked = true;
  state.fillScore = correctCount;
  addReward(correctCount);
  elements.checkFillBtn.disabled = true;

  state.fillFeedbackMessage = `Верно: ${correctCount} / ${state.fillTotal}.`;
  state.fillFeedbackType = correctCount > 0 ? "success" : "error";
  elements.fillFeedback.textContent = state.fillFeedbackMessage;
  elements.fillFeedback.className = `feedback ${state.fillFeedbackType}`;

  fillResultTimeoutId = window.setTimeout(() => {
    renderResults();
    showScreen("result");
  }, 1200);
}

function getResultMessage() {
  const maxScore = state.fillTotal;
  const ratio = maxScore > 0 ? state.stars / maxScore : 0;

  if (ratio >= 0.85) {
    return "Ты настоящий герой кухни. Все слова уже почти твои!";
  }

  if (ratio >= 0.6) {
    return "Очень хорошо! Ещё один круг, и слова запомнятся совсем легко.";
  }

  return "Хорошее начало. Попробуй ещё раз и собери больше вкусных слов.";
}

function renderResults() {
  elements.resultStars.textContent = String(state.stars);
  elements.resultBadges.textContent = String(state.badges);
  elements.resultFillScore.textContent = `${state.fillScore} / ${state.fillTotal}`;
  elements.resultMessage.textContent = getResultMessage();
}

function resetLesson() {
  clearPendingTransitions();
  state.stars = 0;
  state.badges = 0;
  state.fillScore = 0;
  state.fillChecked = false;
  state.fillSelections = fillTemplates.map((item) => item.answers.map(() => ""));
  state.fillFeedbackMessage = "";
  state.fillFeedbackType = "";
  updateScoreboard();
  renderWords();
  showScreen("start");
}

function navigateToStage(stepKey) {
  clearPendingTransitions();

  if (stepKey === "words") {
    renderWords();
  }

  if (stepKey === "fill") {
    renderFillTask();
  }

  if (stepKey === "result") {
    renderResults();
  }

  showScreen(stepKey);
}

elements.startBtn.addEventListener("click", () => {
  navigateToStage("words");
});

elements.wordsNextBtn.addEventListener("click", () => {
  navigateToStage("fill");
});

elements.checkFillBtn.addEventListener("click", checkFillAnswers);
elements.restartBtn.addEventListener("click", resetLesson);
elements.stepButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navigateToStage(button.dataset.step);
  });
});

updateScoreboard();
renderWords();
showScreen("start");
