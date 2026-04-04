const words = [
  { hanzi: "米饭", pinyin: "mǐfàn", ru: "рис", emoji: "🍚" },
  { hanzi: "面条", pinyin: "miàntiáo", ru: "лапша", emoji: "🍜" },
  { hanzi: "苹果", pinyin: "píngguǒ", ru: "яблоко", emoji: "🍎" },
  { hanzi: "水", pinyin: "shuǐ", ru: "вода", emoji: "💧" },
  { hanzi: "牛奶", pinyin: "niúnǎi", ru: "молоко", emoji: "🥛" },
  { hanzi: "包子", pinyin: "bāozi", ru: "баоцзы", emoji: "🥟" },
];

const fillTasks = [
  { fragments: ["我吃", "。"], answers: ["米饭"], hint: "Я ем ..." },
  { fragments: ["我喝", "和", "。"], answers: ["水", "牛奶"], hint: "Я пью ... и ..." },
  { fragments: ["今天我吃", "，喝", "，还有", "。"], answers: ["包子", "水", "苹果"], hint: "Сегодня я ем ..., пью ..., и ещё ..." },
];

const steps = ["start", "words", "quiz", "fill", "result"];
const screens = Object.fromEntries(steps.map((id) => [id, document.getElementById(`${id}Screen`)]));

const starCountEl = document.getElementById("starCount");
const badgeCountEl = document.getElementById("badgeCount");
const rewardToast = document.getElementById("rewardToast");
const progressBar = document.getElementById("progressBar");

let stars = 0;
let badges = 0;
let quizIndex = 0;
let quizItems = [];

function setStep(index) {
  steps.forEach((_, i) => document.getElementById(`step-${i}`)?.classList.toggle("active", i === index));
  progressBar.style.width = `${(index / (steps.length - 1)) * 100}%`;
}

function showScreen(key) {
  Object.values(screens).forEach((screen) => screen.classList.add("hidden"));
  screens[key].classList.remove("hidden");
  setStep(steps.indexOf(key));
}

function addReward(points = 1) {
  stars += points;
  starCountEl.textContent = String(stars);

  if (stars > 0 && stars % 3 === 0) {
    badges += 1;
    badgeCountEl.textContent = String(badges);
    rewardToast.textContent = `🎁 Бонус! Новый стикер #${badges}`;
    rewardToast.classList.remove("hidden");
    setTimeout(() => rewardToast.classList.add("hidden"), 1700);
  }
}

function speak(text) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function renderWords() {
  const grid = document.getElementById("wordGrid");
  grid.innerHTML = "";

  words.forEach((word) => {
    const card = document.createElement("article");
    card.className = "word-card";
    card.innerHTML = `
      <h3>${word.emoji} ${word.hanzi}</h3>
      <p class="muted">${word.pinyin}</p>
      <p>${word.ru}</p>
      <small class="muted">Нажми, чтобы слушать</small>
    `;
    card.addEventListener("click", () => speak(word.hanzi));
    grid.appendChild(card);
  });
}

function buildQuizData() {
  quizItems = words.map((word) => {
    const distractors = words.filter((w) => w.hanzi !== word.hanzi).sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [word, ...distractors].sort(() => Math.random() - 0.5).map((w) => w.ru);

    return {
      prompt: `Что означает ${word.hanzi} (${word.pinyin})?`,
      answer: word.ru,
      options,
    };
  }).sort(() => Math.random() - 0.5);

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

  const current = quizItems[quizIndex];
  document.getElementById("quizPrompt").textContent = `Вопрос ${quizIndex + 1}/${quizItems.length}: ${current.prompt}`;

  const optionsWrap = document.getElementById("quizOptions");
  optionsWrap.innerHTML = "";

  current.options.forEach((optionText) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.type = "button";
    btn.textContent = optionText;

    btn.addEventListener("click", () => {
      const correct = optionText === current.answer;
      if (correct) {
        btn.classList.add("correct");
        feedback.textContent = "Отлично! +1 звезда";
        addReward(1);
      } else {
        btn.classList.add("wrong");
        feedback.textContent = `Почти! Правильный ответ: ${current.answer}`;
      }

      [...optionsWrap.children].forEach((child) => child.setAttribute("disabled", "true"));

      setTimeout(() => {
        quizIndex += 1;
        renderQuizQuestion();
      }, 800);
    });

    optionsWrap.appendChild(btn);
  });
}

function renderFillTask() {
  const container = document.getElementById("fillContainer");
  container.innerHTML = "";

  fillTasks.forEach((task, rowIndex) => {
    const row = document.createElement("div");
    row.className = "blank-row";

    const hint = document.createElement("p");
    hint.className = "muted";
    hint.textContent = task.hint;
    row.appendChild(hint);

    const sentence = document.createElement("div");

    task.answers.forEach((_, blankIndex) => {
      sentence.append(task.fragments[blankIndex]);
      const select = document.createElement("select");
      select.dataset.row = String(rowIndex);
      select.dataset.blank = String(blankIndex);

      const blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "...";
      select.appendChild(blank);

      words.forEach((word) => {
        const opt = document.createElement("option");
        opt.value = word.hanzi;
        opt.textContent = `${word.hanzi} (${word.ru})`;
        select.appendChild(opt);
      });

      sentence.append(select);
    });

    sentence.append(task.fragments.at(-1));
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
      if (select?.value === answer) correct += 1;
    });
  });

  document.getElementById("fillFeedback").textContent = `Правильно ${correct} из ${total}.`;
  addReward(correct);

  setTimeout(() => {
    document.getElementById("resultText").textContent =
      `Ты собрал ${stars} ⭐ и ${badges} 🏅. Вставки: ${correct}/${total}. ${stars >= 8 ? "Супер результат!" : "Отличное начало, продолжай!"}`;
    showScreen("result");
  }, 700);
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
  showScreen("quiz");
  renderQuizQuestion();
});

document.getElementById("checkFillBtn").addEventListener("click", checkFillAnswers);
document.getElementById("restartBtn").addEventListener("click", resetLesson);

showScreen("start");
