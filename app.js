const words = [
  { hanzi: "米饭", pinyin: "mǐfàn", ru: "рис", emoji: "🍚" },
  { hanzi: "面条", pinyin: "miàntiáo", ru: "лапша", emoji: "🍜" },
  { hanzi: "苹果", pinyin: "píngguǒ", ru: "яблоко", emoji: "🍎" },
  { hanzi: "水", pinyin: "shuǐ", ru: "вода", emoji: "💧" },
  { hanzi: "牛奶", pinyin: "niúnǎi", ru: "молоко", emoji: "🥛" },
  { hanzi: "包子", pinyin: "bāozi", ru: "баоцзы", emoji: "🥟" },
];

const fillTasks = [
  {
    fragments: ["我吃", "。"],
    answers: ["米饭"],
    hint: "Я ем ...",
  },
  {
    fragments: ["我喝", "和", "。"],
    answers: ["水", "牛奶"],
    hint: "Я пью ... и ...",
  },
  {
    fragments: ["今天我吃", "，喝", "，还有", "。"],
    answers: ["包子", "水", "苹果"],
    hint: "Сегодня я ем ..., пью ..., и ещё ...",
  },
];

const screens = {
  start: document.getElementById("startScreen"),
  words: document.getElementById("wordsScreen"),
  quiz: document.getElementById("quizScreen"),
  fill: document.getElementById("fillScreen"),
  result: document.getElementById("resultScreen"),
};

const starCountEl = document.getElementById("starCount");
const badgeCountEl = document.getElementById("badgeCount");
const rewardToast = document.getElementById("rewardToast");

let stars = 0;
let badges = 0;
let quizIndex = 0;
let quizItems = [];

function showScreen(key) {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[key].classList.remove("hidden");
}

function addReward(points = 1) {
  stars += points;
  starCountEl.textContent = String(stars);

  if (stars > 0 && stars % 3 === 0) {
    badges += 1;
    badgeCountEl.textContent = String(badges);
    rewardToast.textContent = `🎁 Круто! Ты получил стикер #${badges}`;
    rewardToast.classList.remove("hidden");
    window.setTimeout(() => rewardToast.classList.add("hidden"), 1800);
  }
}

function speak(text) {
  if (!window.speechSynthesis) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function renderWords() {
  const grid = document.getElementById("wordGrid");
  grid.innerHTML = "";
  words.forEach((word) => {
    const card = document.createElement("article");
    card.className = "word-card";
    card.innerHTML = `
      <h3>${word.emoji} ${word.hanzi}</h3>
      <p class="phonetic">${word.pinyin}</p>
      <p>${word.ru}</p>
      <button class="listen">🔊 Слушать</button>
    `;

    card.querySelector(".listen").addEventListener("click", () => speak(word.hanzi));
    grid.appendChild(card);
  });
}

function buildQuizData() {
  quizItems = words.map((current) => {
    const pool = words.filter((w) => w.hanzi !== current.hanzi);
    const shuffledPool = pool.sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [current, ...shuffledPool].sort(() => Math.random() - 0.5);

    return {
      prompt: `Как переводится ${current.hanzi} (${current.pinyin})?`,
      answer: current.ru,
      options: options.map((opt) => opt.ru),
    };
  });
  quizItems = quizItems.sort(() => Math.random() - 0.5);
  quizIndex = 0;
}

function renderQuizQuestion() {
  const feedback = document.getElementById("quizFeedback");
  feedback.textContent = "";

  if (quizIndex >= quizItems.length) {
    renderFillTask();
    showScreen("fill");
    return;
  }

  const item = quizItems[quizIndex];
  document.getElementById("quizPrompt").textContent = `Вопрос ${quizIndex + 1}/${quizItems.length}: ${item.prompt}`;

  const optionsEl = document.getElementById("quizOptions");
  optionsEl.innerHTML = "";

  item.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.textContent = opt;

    btn.addEventListener("click", () => {
      const isCorrect = opt === item.answer;
      if (isCorrect) {
        btn.classList.add("correct");
        feedback.textContent = "Правильно! ⭐";
        addReward(1);
      } else {
        btn.classList.add("wrong");
        feedback.textContent = `Почти! Правильный ответ: ${item.answer}`;
      }

      Array.from(optionsEl.children).forEach((child) => {
        child.setAttribute("disabled", "true");
      });

      setTimeout(() => {
        quizIndex += 1;
        renderQuizQuestion();
      }, 900);
    });

    optionsEl.appendChild(btn);
  });
}

function renderFillTask() {
  const container = document.getElementById("fillContainer");
  container.innerHTML = "";

  fillTasks.forEach((task, rowIndex) => {
    const row = document.createElement("div");
    row.className = "blank-row";

    const hint = document.createElement("p");
    hint.textContent = task.hint;
    row.appendChild(hint);

    const sentence = document.createElement("div");

    task.answers.forEach((_, blankIndex) => {
      sentence.append(task.fragments[blankIndex]);
      const select = document.createElement("select");
      select.dataset.row = String(rowIndex);
      select.dataset.blank = String(blankIndex);

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "...";
      select.appendChild(placeholder);

      words.forEach((word) => {
        const option = document.createElement("option");
        option.value = word.hanzi;
        option.textContent = `${word.hanzi} (${word.ru})`;
        select.appendChild(option);
      });
      sentence.append(select);
    });

    sentence.append(task.fragments[task.fragments.length - 1]);
    row.appendChild(sentence);
    container.appendChild(row);
  });
}

function checkFillAnswers() {
  let correct = 0;
  let total = 0;

  fillTasks.forEach((task, rowIndex) => {
    task.answers.forEach((answer, blankIndex) => {
      total += 1;
      const select = document.querySelector(`select[data-row="${rowIndex}"][data-blank="${blankIndex}"]`);
      if (select && select.value === answer) {
        correct += 1;
      }
    });
  });

  document.getElementById("fillFeedback").textContent = `Ты заполнил правильно ${correct} из ${total}.`;
  addReward(correct);

  setTimeout(() => {
    showResults(correct, total);
    showScreen("result");
  }, 900);
}

function showResults(correct, total) {
  const text = [
    `Ты собрал ${stars} звёзд и ${badges} наград!`,
    `В пропусках: ${correct}/${total} правильных ответов.`,
    stars >= 8
      ? "Супер! Ты настоящий мастер слов про еду!"
      : "Отличная работа! В следующий раз будет ещё лучше!",
  ].join(" ");

  document.getElementById("resultText").textContent = text;
}

function resetLesson() {
  stars = 0;
  badges = 0;
  quizIndex = 0;
  quizItems = [];
  starCountEl.textContent = "0";
  badgeCountEl.textContent = "0";
  document.getElementById("quizFeedback").textContent = "";
  document.getElementById("fillFeedback").textContent = "";
  showScreen("start");
}

document.getElementById("startLessonBtn").addEventListener("click", () => {
  renderWords();
  showScreen("words");
});

document.getElementById("toQuizBtn").addEventListener("click", () => {
  buildQuizData();
  renderQuizQuestion();
  showScreen("quiz");
});

document.getElementById("checkFillBtn").addEventListener("click", checkFillAnswers);
document.getElementById("restartBtn").addEventListener("click", resetLesson);

showScreen("start");
