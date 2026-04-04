const { useCallback, useEffect, useMemo, useRef, useState } = React;

const ALL_LESSONS = [
  {
    id: "food",
    title: "Еда 食物",
    icon: "🍚",
    color: "#FF6B6B",
    vocabulary: [
      { hanzi: "米饭", pinyin: "mǐfàn", ru: "рис", emoji: "🍚" },
      { hanzi: "鸡蛋", pinyin: "jīdàn", ru: "яйцо", emoji: "🥚" },
      { hanzi: "苹果", pinyin: "píngguǒ", ru: "яблоко", emoji: "🍎" },
      { hanzi: "牛奶", pinyin: "niúnǎi", ru: "молоко", emoji: "🥛" },
      { hanzi: "面包", pinyin: "miànbāo", ru: "хлеб", emoji: "🍞" },
      { hanzi: "鱼", pinyin: "yú", ru: "рыба", emoji: "🐟" },
      { hanzi: "水", pinyin: "shuǐ", ru: "вода", emoji: "💧" },
      { hanzi: "汤", pinyin: "tāng", ru: "суп", emoji: "🍲" },
      { hanzi: "肉", pinyin: "ròu", ru: "мясо", emoji: "🍖" },
      { hanzi: "蔬菜", pinyin: "shūcài", ru: "овощи", emoji: "🥦" },
    ],
    exercises: [
      { hint: "Я люблю есть рис и рыбу.", full: "我喜欢吃米饭和鱼。", template: "我喜欢吃{米饭}和{鱼}。", distractors: ["水", "汤"] },
      { hint: "На завтрак я ем яйцо и хлеб.", full: "早餐我吃鸡蛋和面包。", template: "早餐我吃{鸡蛋}和{面包}。", distractors: ["肉", "苹果"] },
      { hint: "Я пью молоко и воду.", full: "我喝牛奶和水。", template: "我喝{牛奶}和{水}。", distractors: ["鱼", "汤"] },
      { hint: "На ужин у нас суп и мясо.", full: "晚饭我们有汤和肉。", template: "晚饭我们有{汤}和{肉}。", distractors: ["蔬菜", "苹果"] },
      { hint: "Я ем овощи и рис.", full: "我吃蔬菜和米饭。", template: "我吃{蔬菜}和{米饭}。", distractors: ["鸡蛋", "牛奶"] },
      { hint: "Ребёнок ест яблоко и пьёт молоко.", full: "孩子吃苹果，喝牛奶。", template: "孩子吃{苹果}，喝{牛奶}。", distractors: ["水", "鱼"] },
    ],
  },
  {
    id: "family", title: "Семья 家人", icon: "👨‍👩‍👧‍👦", color: "#4D96FF",
    vocabulary: [
      { hanzi: "妈妈", pinyin: "māma", ru: "мама", emoji: "👩" }, { hanzi: "爸爸", pinyin: "bàba", ru: "папа", emoji: "👨" },
      { hanzi: "哥哥", pinyin: "gēge", ru: "старший брат", emoji: "🧑" }, { hanzi: "姐姐", pinyin: "jiějie", ru: "старшая сестра", emoji: "👧" },
      { hanzi: "弟弟", pinyin: "dìdi", ru: "младший брат", emoji: "👦" }, { hanzi: "妹妹", pinyin: "mèimei", ru: "младшая сестра", emoji: "👧" },
      { hanzi: "爷爷", pinyin: "yéye", ru: "дедушка", emoji: "👴" }, { hanzi: "奶奶", pinyin: "nǎinai", ru: "бабушка", emoji: "👵" },
      { hanzi: "家", pinyin: "jiā", ru: "дом", emoji: "🏠" }, { hanzi: "爱", pinyin: "ài", ru: "любовь", emoji: "❤️" },
    ],
    exercises: [
      { hint: "Я люблю маму и папу.", full: "我爱妈妈和爸爸。", template: "我爱{妈妈}和{爸爸}。", distractors: ["家", "姐姐"] },
      { hint: "Старший брат и младший брат дома.", full: "哥哥和弟弟在家。", template: "{哥哥}和{弟弟}在{家}。", distractors: ["爱", "奶奶"] },
      { hint: "Бабушка и дедушка любят меня.", full: "爷爷和奶奶爱我。", template: "{爷爷}和{奶奶}{爱}我。", distractors: ["爸爸", "家"] },
      { hint: "Сестра любит маму.", full: "姐姐爱妈妈。", template: "{姐姐}{爱}{妈妈}。", distractors: ["弟弟", "家"] },
      { hint: "Младшая сестра и папа дома.", full: "妹妹和爸爸在家。", template: "{妹妹}和{爸爸}在{家}。", distractors: ["爷爷", "爱"] },
      { hint: "Наша семья полна любви.", full: "我们的家有爱。", template: "我们的{家}有{爱}。", distractors: ["妈妈", "弟弟"] },
    ],
  },
  {
    id: "animals", title: "Животные 动物", icon: "🐱", color: "#6BCB77",
    vocabulary: [
      { hanzi: "猫", pinyin: "māo", ru: "кошка", emoji: "🐱" }, { hanzi: "狗", pinyin: "gǒu", ru: "собака", emoji: "🐶" },
      { hanzi: "鱼", pinyin: "yú", ru: "рыба", emoji: "🐟" }, { hanzi: "鸟", pinyin: "niǎo", ru: "птица", emoji: "🐦" },
      { hanzi: "兔子", pinyin: "tùzi", ru: "кролик", emoji: "🐰" }, { hanzi: "马", pinyin: "mǎ", ru: "лошадь", emoji: "🐴" },
      { hanzi: "牛", pinyin: "niú", ru: "корова", emoji: "🐮" }, { hanzi: "猪", pinyin: "zhū", ru: "свинья", emoji: "🐷" },
      { hanzi: "龙", pinyin: "lóng", ru: "дракон", emoji: "🐉" }, { hanzi: "熊猫", pinyin: "xióngmāo", ru: "панда", emoji: "🐼" },
    ],
    exercises: [
      { hint: "Кошка и собака играют.", full: "猫和狗在玩。", template: "{猫}和{狗}在玩。", distractors: ["牛", "龙"] },
      { hint: "Панда ест, птица летает.", full: "熊猫吃，鸟飞。", template: "{熊猫}吃，{鸟}飞。", distractors: ["猪", "鱼"] },
      { hint: "Кролик и лошадь бегут.", full: "兔子和马在跑。", template: "{兔子}和{马}在跑。", distractors: ["猫", "牛"] },
      { hint: "В воде рыба.", full: "水里有鱼。", template: "水里有{鱼}。", distractors: ["狗", "龙"] },
      { hint: "Корова и свинья на ферме.", full: "牛和猪在农场。", template: "{牛}和{猪}在农场。", distractors: ["鸟", "马"] },
      { hint: "Дракон любит панду.", full: "龙喜欢熊猫。", template: "{龙}喜欢{熊猫}。", distractors: ["猫", "兔子"] },
    ],
  },
  {
    id: "numbers", title: "Числа 数字", icon: "🔢", color: "#FFD93D",
    vocabulary: ["一","二","三","四","五","六","七","八","九","十"].map((n,i)=>({hanzi:n,pinyin:["yī","èr","sān","sì","wǔ","liù","qī","bā","jiǔ","shí"][i],ru:String(i+1),emoji:"🔢"})),
    exercises: [
      { hint: "Один, два, три.", full: "一二三。", template: "{一}{二}{三}。", distractors: ["四", "五"] },
      { hint: "Четыре и пять.", full: "四和五。", template: "{四}和{五}。", distractors: ["一", "九"] },
      { hint: "Шесть, семь, восемь.", full: "六七八。", template: "{六}{七}{八}。", distractors: ["二", "三"] },
      { hint: "Девять и десять.", full: "九和十。", template: "{九}和{十}。", distractors: ["四", "六"] },
      { hint: "Два и восемь.", full: "二和八。", template: "{二}和{八}。", distractors: ["七", "十"] },
      { hint: "Три, пять, семь.", full: "三五七。", template: "{三}{五}{七}。", distractors: ["一", "六"] },
    ],
  },
  {
    id: "colors", title: "Цвета 颜色", icon: "🎨", color: "#B983FF",
    vocabulary: [
      ["红色","hóngsè","красный","❤️"],["蓝色","lánsè","синий","💙"],["绿色","lǜsè","зелёный","💚"],["黄色","huángsè","жёлтый","💛"],["白色","báisè","белый","🤍"],["黑色","hēisè","чёрный","🖤"],["紫色","zǐsè","фиолетовый","💜"],["橙色","chéngsè","оранжевый","🧡"],["粉色","fěnsè","розовый","🩷"],["灰色","huīsè","серый","🩶"]
    ].map(([hanzi,pinyin,ru,emoji])=>({hanzi,pinyin,ru,emoji})),
    exercises: [
      { hint: "Я люблю красный и синий.", full: "我喜欢红色和蓝色。", template: "我喜欢{红色}和{蓝色}。", distractors: ["黑色", "白色"] },
      { hint: "Трава зелёная.", full: "草是绿色。", template: "草是{绿色}。", distractors: ["粉色", "橙色"] },
      { hint: "Солнце жёлтое.", full: "太阳是黄色。", template: "太阳是{黄色}。", distractors: ["灰色", "蓝色"] },
      { hint: "Панда чёрно-белая.", full: "熊猫是黑色和白色。", template: "熊猫是{黑色}和{白色}。", distractors: ["红色", "紫色"] },
      { hint: "Мой рюкзак фиолетовый.", full: "我的书包是紫色。", template: "我的书包是{紫色}。", distractors: ["绿色", "灰色"] },
      { hint: "Роза розовая и оранжевая.", full: "玫瑰是粉色和橙色。", template: "玫瑰是{粉色}和{橙色}。", distractors: ["白色", "黄色"] },
    ],
  },
];

const TOKENS = { bg: "linear-gradient(135deg, #FFF5E4, #FFE3E3, #E8D5FF)", blue: "#4D96FF", green: "#6BCB77", red: "#FF6B6B", yellow: "#FFD93D", text: "#2D3436", candy: "#FF85C2" };
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const parseTemplate = (template) => {
  const parts = [];
  const answers = [];
  const re = /\{([^}]+)\}/g;
  let m, last = 0;
  while ((m = re.exec(template))) {
    parts.push(template.slice(last, m.index));
    parts.push(null);
    answers.push(m[1]);
    last = re.lastIndex;
  }
  parts.push(template.slice(last));
  return { parts, answers };
};

let audioCtx;
const getAudioCtx = async () => {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") await audioCtx.resume();
  return audioCtx;
};
const playTone = async (freq, duration = 100, type = "sine", gain = 0.12, when = 0) => {
  const ctx = await getAudioCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type; o.frequency.value = freq; g.gain.value = gain;
  o.connect(g); g.connect(ctx.destination);
  const t = ctx.currentTime + when;
  o.start(t); g.gain.exponentialRampToValueAtTime(0.0001, t + duration / 1000); o.stop(t + duration / 1000);
};
const SFX = {
  click: () => playTone(880, 80, "sine", 0.12),
  success: () => [523,659,784,1047].forEach((f,i)=>playTone(f,250,"sine",0.12,i*0.12)),
  wrong: () => { playTone(300,200,"square",0.1,0); playTone(220,300,"square",0.1,0.15); },
  star: () => [800,1000,1200,1400,1600].forEach((f,i)=>playTone(f,120,"triangle",0.1,i*0.06)),
};

function SpeakBtn({ text, tiny }) {
  const [on, setOn] = useState(false);
  const speak = (e) => {
    ["stopPropagation", "preventDefault"].forEach((k) => e[k] && e[k]());
    setOn(true); setTimeout(() => setOn(false), 1500);
    SFX.click();
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&q=${encodeURIComponent(text)}`;
    const audio = new Audio(url);
    audio.play().catch(() => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN"; u.rate = 0.8;
      const zh = speechSynthesis.getVoices().find(v => v.lang?.includes("zh"));
      if (zh) u.voice = zh;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    });
  };
  return <span onClick={speak} onMouseDown={(e)=>e.stopPropagation()} onPointerDown={(e)=>e.stopPropagation()} style={{cursor:"pointer",display:"inline-block",marginLeft:6,transform:on?"scale(1.3)":"scale(1)",transition:".2s",fontSize:tiny?12:20}}>🔊</span>;
}

const Confetti = ({ seed }) => <div key={seed}>{Array.from({length:60}).map((_,i)=><span key={i} style={{position:"fixed",left:`${Math.random()*100}%`,top:"-20px",width:8+Math.random()*8,height:8+Math.random()*8,borderRadius:Math.random()>.5?"50%":"2px",background:["#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#b983ff","#ff9f1c","#00c2a8","#ff85a1"][i%8],animation:`cf${i%3} ${1.8+Math.random()*1.2}s ${Math.random()*0.8}s linear forwards`,pointerEvents:"none",zIndex:50}} />)}</div>;
const Floating = ({ seed, emojis }) => <div key={seed}>{Array.from({length:12}).map((_,i)=><span key={i} style={{position:"fixed",bottom:"-20px",left:`${10+Math.random()*80}%`,fontSize:24+Math.random()*24,animation:`floatUp ${2+Math.random()*1.5}s ${Math.random()*0.5}s ease-out forwards`,pointerEvents:"none",zIndex:40}}>{emojis[i%emojis.length]}</span>)}</div>;

function ChineseLessons() {
  const [lessons, setLessons] = useState(ALL_LESSONS);
  const [lessonIdx, setLessonIdx] = useState(null);
  const [screen, setScreen] = useState("menu");
  const [exIdx, setExIdx] = useState(0);
  const [blanks, setBlanks] = useState([]);
  const [wordBank, setWordBank] = useState([]);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState([]);
  const [stars, setStars] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [floatKey, setFloatKey] = useState(0);
  const [editDraft, setEditDraft] = useState(null);
  const [editTab, setEditTab] = useState("words");
  const [jsonText, setJsonText] = useState("");

  const lesson = lessonIdx == null ? null : lessons[lessonIdx];
  const exercises = useMemo(() => lesson?.exercises || [], [lesson]);
  const currentEx = exercises[exIdx];
  const parsed = currentEx ? parseTemplate(currentEx.template) : { parts: [], answers: [] };

  const initRef = useRef(null);
  initRef.current = (idx) => {
    const ex = exercises[idx];
    if (!ex) return;
    const p = parseTemplate(ex.template);
    const list = [...p.answers, ...(ex.distractors || [])].map((hanzi, i) => ({ hanzi, used: false, bankIdx: i }));
    setWordBank(shuffle(list));
    setBlanks(Array(p.answers.length).fill(null));
    setChecked(false); setResults([]);
  };
  const initExercise = useCallback((idx) => initRef.current(idx), []);
  useEffect(() => {
    if (screen === "exercise" && exercises.length) initExercise(exIdx);
  }, [screen, exIdx, exercises.length, initExercise]);

  const wordMeta = useMemo(() => Object.fromEntries((lesson?.vocabulary || []).map((w) => [w.hanzi, w])), [lesson]);
  const triggerEffects = (emojis) => {
    setConfettiKey((k) => k + 1); setFloatKey((k) => k + 1);
    setShowConfetti(true); setShowFloating(true);
    setTimeout(() => { setShowConfetti(false); setShowFloating(false); }, 100);
    if (emojis) return emojis;
    return ["⭐", "🌟", "🏆", "🎉"];
  };

  const placeWord = (idx) => {
    if (checked || wordBank[idx]?.used) return;
    SFX.click();
    const bi = blanks.findIndex((b) => b === null);
    if (bi < 0) return;
    const wb = [...wordBank]; wb[idx].used = true;
    const bl = [...blanks]; bl[bi] = { hanzi: wb[idx].hanzi, bankIdx: idx };
    setWordBank(wb); setBlanks(bl);
  };
  const removeBlank = (i) => {
    if (checked || !blanks[i]) return;
    const wb = [...wordBank]; wb[blanks[i].bankIdx].used = false;
    const bl = [...blanks]; bl[i] = null;
    setWordBank(wb); setBlanks(bl);
  };
  const checkAnswers = () => {
    if (blanks.some((b) => !b)) return;
    const res = blanks.map((b, i) => b.hanzi === parsed.answers[i]);
    const ok = res.every(Boolean);
    setResults(res); setChecked(true);
    if (ok) {
      SFX.success(); setTimeout(SFX.star, 500);
      setShowStar(true); setTimeout(() => setShowStar(false), 700);
      setStars((s) => s + 1);
      triggerEffects(parsed.answers.map((h) => wordMeta[h]?.emoji || "🎉"));
    } else {
      SFX.wrong(); setShaking(true); setWrongFlash(true);
      setTimeout(() => setShaking(false), 700); setTimeout(() => setWrongFlash(false), 1500);
    }
  };

  const nextExercise = () => {
    SFX.click();
    if (exIdx + 1 < exercises.length) setExIdx(exIdx + 1);
    else setScreen("result");
  };

  const saveLesson = () => {
    const copy = [...lessons]; copy[lessonIdx] = editDraft; setLessons(copy); setScreen("menu");
  };

  if (screen === "menu") return <div style={styles.page}><style>{keyframes}</style><div style={styles.wrap}><h1 style={styles.h1}>🐼 Учим китайский играя!</h1><div style={styles.sub}>Выбери весёлый урок ✨</div><div style={{marginTop:8,fontSize:24}}>🦄 🍭 ⭐ 🎈 🐼</div><div style={styles.grid}>{lessons.map((l, i)=><div key={l.id} onClick={()=>{setLessonIdx(i);setExIdx(0);setStars(0);setScreen("vocab");}} style={{...styles.lessonCard, borderTop:`4px solid ${l.color}`, animation:`bounceIn .5s ${i*0.1}s both`}}><div style={{fontSize:48}}>{l.icon}</div><div style={{fontWeight:800,fontSize:18}}>{l.title}</div><div style={{fontSize:13,color:"#888"}}>{l.vocabulary.length} словечек · {l.exercises.length} игр</div><button onClick={(e)=>{e.stopPropagation(); setLessonIdx(i); setEditDraft(JSON.parse(JSON.stringify(l))); setJsonText(JSON.stringify(l,null,2)); setEditTab("words"); setScreen("editor");}} style={styles.editBtn}>Редактировать</button></div>)}<div style={{...styles.lessonCard,border:"2px dashed #999"}} onClick={()=>{const n={id:`lesson_${Date.now()}`,title:"Новый урок",icon:"📖",color:"#888",vocabulary:[],exercises:[]}; setLessons([...lessons,n]); setLessonIdx(lessons.length); setEditDraft(n); setJsonText(JSON.stringify(n,null,2)); setScreen("editor");}}>+ Новый волшебный урок</div></div></div></div>;

  if (screen === "vocab") return <div style={styles.page}><style>{keyframes}</style><div style={styles.wrap}><button style={styles.back} onClick={()=>setScreen("menu")}>← К урокам 🏠</button><h2 style={styles.h2}>Запомни эти супер-слова! 🌈</h2><div style={styles.sub}>{lesson.title}</div><div style={{fontSize:22,marginTop:6}}>👏 Повторяй вслух и нажимай на 🔊</div><div style={styles.vocabGrid}>{lesson.vocabulary.map((w,i)=><div key={w.hanzi} style={{...styles.vocabCard,animation:`bounceIn .5s ${i*0.08}s both`}}><div style={{fontSize:36}}>{w.emoji}</div><div style={{fontSize:28,color:"#fff",fontWeight:800}}>{w.hanzi}<SpeakBtn text={w.hanzi} /></div><div style={{fontSize:13,color:"rgba(255,255,255,.8)"}}>{w.pinyin}</div><div style={styles.pill}>{w.ru}</div></div>)}</div><button style={styles.greenBtn} onClick={()=>setScreen("exercise")}>К весёлым заданиям! 🚀</button></div></div>;

  if (screen === "exercise") {
    const done = checked && results.every(Boolean);
    return <div style={{...styles.page, background: wrongFlash ? "linear-gradient(135deg,#ffd0d0,#ffe3e3,#ffd6d6)" : TOKENS.bg}}><style>{keyframes}</style>{showConfetti&&<Confetti seed={confettiKey}/>} {showFloating&&<Floating seed={floatKey} emojis={parsed.answers.map((h)=>wordMeta[h]?.emoji||"🎉")}/>}<div style={{...styles.wrap, boxShadow: done?"0 0 40px rgba(107,203,119,.4)":"none", animation: shaking ? "shakeX .6s" : "none"}}><div>{Array.from({length:exercises.length}).map((_,i)=><span key={i} style={{fontSize:28,filter:i<stars?"none":"grayscale(1)",opacity:i<stars?1:.3,display:"inline-block",animation:i===stars-1&&showStar?"starSpin .6s":"none"}}>⭐</span>)}</div><div style={{marginTop:8}}>Раунд {exIdx+1} из {exercises.length}<div style={{height:6,background:"#eee",borderRadius:8,overflow:"hidden"}}><div style={{height:"100%",width:`${((exIdx+1)/exercises.length)*100}%`,background:"linear-gradient(90deg,#FFD93D,#FF6B6B)"}}/></div></div><div style={styles.hint}>💡 {currentEx.hint}<SpeakBtn text={currentEx.full} /></div><div style={styles.sentence}>{parsed.parts.map((p,i)=>p!==null?<span key={i}>{p}</span>:<span key={i} onClick={()=>removeBlank(Math.floor(i/2))} style={{...styles.blank,...(blanks[Math.floor(i/2)]?styles.filledBlank:{}),...(checked?(results[Math.floor(i/2)]?styles.okBlank:styles.badBlank):{})}}>{blanks[Math.floor(i/2)]?<>{blanks[Math.floor(i/2)].hanzi}<div style={{fontSize:11}}>{wordMeta[blanks[Math.floor(i/2)].hanzi]?.pinyin}</div><SpeakBtn tiny text={blanks[Math.floor(i/2)].hanzi}/></>:
<span style={{opacity:.3}}>___</span>}</span>)}</div>{checked && <div style={{...styles.feedback, background: done?"linear-gradient(135deg,#d4f9d8,#b9f6ca)":"linear-gradient(135deg,#ffd9d9,#ffb8b8)"}}>{done?"🎉 Ура! Всё правильно! +1 ⭐":<span>😿 Не совсем... Правильно: {parsed.answers.map((a)=>`${wordMeta[a]?.emoji||""} ${a} (${wordMeta[a]?.pinyin||""})`).join(", ")}</span>}</div>}{!checked&&<div style={styles.bank}>{wordBank.map((w,i)=><button key={i} disabled={w.used} onClick={()=>placeWord(i)} style={{...styles.chip,...(w.used?styles.usedChip:{})}}>{w.hanzi}<div style={{fontSize:11}}>{wordMeta[w.hanzi]?.pinyin}</div><SpeakBtn tiny text={w.hanzi}/></button>)}</div>}<div style={{marginTop:16}}>{!checked?<button style={{...styles.greenBtn,opacity:blanks.some((b)=>!b)?.6:1}} disabled={blanks.some((b)=>!b)} onClick={checkAnswers}>Проверить ответ 🪄</button>:done?<button style={styles.blueBtn} onClick={nextExercise}>{exIdx===exercises.length-1?"Мои звёзды":"Дальше ▶"}</button>:<><button style={styles.yellowBtn} onClick={()=>initExercise(exIdx)}>Ещё попытка 💛</button> <button style={styles.blueBtn} onClick={nextExercise}>Дальше ▶</button></>}</div></div></div>;
  }

  if (screen === "result") {
    const pct = exercises.length ? Math.round((stars / exercises.length) * 100) : 0;
    const tier = pct===100?["🏆","Вау! Ты супер-чемпион! Все верно!"] : pct>=70?["🌟","Класс! Очень здорово получилось!"] : pct>=40?["💪","Ты молодец! Ещё чуть-чуть и будет супер!"] : ["📚","Ничего страшного! Давай попробуем снова!"];
    return <div style={styles.page}><style>{keyframes}</style>{pct>=70&&showConfetti&&<Confetti seed={confettiKey}/>}{pct>=70&&showFloating&&<Floating seed={floatKey} emojis={["⭐","🌟","🏆","🎉"]}/>}<div style={styles.wrap}><div style={{fontSize:72}}>{tier[0]}</div><h2>{tier[1]}</h2><div>{Array.from({length:exercises.length}).map((_,i)=><span key={i} style={{fontSize:48,filter:i<stars?"none":"grayscale(1)",opacity:i<stars?1:.3,display:"inline-block",animation:i<stars?`starSpin .6s ${i*0.1}s both`:"none"}}>⭐</span>)}</div><h3>{stars} из {exercises.length} звёзд</h3><button style={styles.greenBtn} onClick={()=>{setExIdx(0);setStars(0);setScreen("exercise")}}>Играть снова 🔁</button> <button style={styles.blueBtn} onClick={()=>setScreen("menu")}>К урокам 🏠</button></div></div>;
  }

  return <div style={styles.page}><style>{keyframes}</style><div style={styles.wrap}><h2>Редактор урока 🧩</h2><div><button style={styles.greenBtn} onClick={saveLesson}>Сохранить ✅</button> <button style={styles.blueBtn} onClick={()=>setScreen("menu")}>Отмена ↩</button></div><div style={{display:"flex",gap:8,marginTop:10}}><input value={editDraft.title} onChange={(e)=>setEditDraft({...editDraft,title:e.target.value})} /><input value={editDraft.icon} onChange={(e)=>setEditDraft({...editDraft,icon:e.target.value})} style={{width:70}}/></div><div style={{marginTop:10}}>{["words","ex","json"].map(t=><button key={t} style={styles.editBtn} onClick={()=>setEditTab(t)}>{t==="words"?"Слова":t==="ex"?"Предложения":"JSON"}</button>)}</div>{editTab==="words"&&<div>{editDraft.vocabulary.map((w,i)=><div key={i} style={{display:"flex",gap:6,marginTop:6}}><input style={{width:48}} value={w.emoji} onChange={e=>{const v=[...editDraft.vocabulary]; v[i]={...w,emoji:e.target.value}; setEditDraft({...editDraft,vocabulary:v});}}/><input style={{width:72}} value={w.hanzi} onChange={e=>{const v=[...editDraft.vocabulary]; v[i]={...w,hanzi:e.target.value}; setEditDraft({...editDraft,vocabulary:v});}}/><input style={{width:90}} value={w.pinyin} onChange={e=>{const v=[...editDraft.vocabulary]; v[i]={...w,pinyin:e.target.value}; setEditDraft({...editDraft,vocabulary:v});}}/><input style={{flex:1}} value={w.ru} onChange={e=>{const v=[...editDraft.vocabulary]; v[i]={...w,ru:e.target.value}; setEditDraft({...editDraft,vocabulary:v});}}/><button onClick={()=>setEditDraft({...editDraft,vocabulary:editDraft.vocabulary.filter((_,x)=>x!==i)})}>✕</button></div>)}<button style={styles.blueBtn} onClick={()=>setEditDraft({...editDraft,vocabulary:[...editDraft.vocabulary,{emoji:"📖",hanzi:"",pinyin:"",ru:""}]})}>+ Добавить слово</button></div>}{editTab==="ex"&&<div>{editDraft.exercises.map((x,i)=><div key={i} style={{border:"1px solid #ddd",padding:8,marginTop:8}}><input placeholder="Подсказка" style={{width:"100%"}} value={x.hint} onChange={e=>{const ex=[...editDraft.exercises]; ex[i]={...x,hint:e.target.value}; setEditDraft({...editDraft,exercises:ex});}}/><input placeholder="Шаблон" style={{width:"100%"}} value={x.template} onChange={e=>{const ex=[...editDraft.exercises]; ex[i]={...x,template:e.target.value}; setEditDraft({...editDraft,exercises:ex});}}/><input placeholder="Полное предложение" style={{width:"100%"}} value={x.full} onChange={e=>{const ex=[...editDraft.exercises]; ex[i]={...x,full:e.target.value}; setEditDraft({...editDraft,exercises:ex});}}/><input placeholder="Обманки" style={{width:"100%"}} value={(x.distractors||[]).join(",")} onChange={e=>{const ex=[...editDraft.exercises]; ex[i]={...x,distractors:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}; setEditDraft({...editDraft,exercises:ex});}}/></div>)}<button style={styles.blueBtn} onClick={()=>setEditDraft({...editDraft,exercises:[...editDraft.exercises,{hint:"",template:"",full:"",distractors:[]}]})}>+ Добавить предложение</button></div>}{editTab==="json"&&<div><textarea rows={18} style={{width:"100%"}} value={jsonText} onChange={(e)=>setJsonText(e.target.value)}/><button style={styles.greenBtn} onClick={()=>{try{setEditDraft(JSON.parse(jsonText));alert("JSON применён");}catch{alert("Ошибка JSON");}}}>Применить JSON</button></div>}</div></div>;
}

const styles = {
  page: { minHeight: "100vh", background: TOKENS.bg, fontFamily: "Comic Sans MS, Segoe UI, system-ui, sans-serif", color: TOKENS.text, padding: 16 },
  wrap: { maxWidth: 980, margin: "0 auto", background: "rgba(255,255,255,.86)", borderRadius: 30, padding: 22, border:"3px solid #fff" },
  h1: { fontSize: 36, margin: 0, fontWeight: 800 }, h2: { marginBottom: 4 }, sub: { color: "#636E72" },
  grid: { marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 16 },
  lessonCard: { background: "#fff", borderRadius: 28, padding: 14, boxShadow: "0 10px 24px rgba(0,0,0,.14)", cursor: "pointer", transition: ".2s", transform:"translateY(0)" },
  editBtn: { border: 0, borderRadius: 10, padding: "6px 10px", background: "#eee", marginTop: 8, cursor: "pointer" },
  back: { border: 0, background: "#eee", borderRadius: 12, padding: "8px 12px" },
  vocabGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginTop: 12 },
  vocabCard: { borderRadius: 20, padding: 10, background: "linear-gradient(135deg, #667eea, #764ba2)", textAlign: "center" },
  pill: { display: "inline-block", marginTop: 6, padding: "2px 8px", borderRadius: 999, background: "rgba(255,255,255,.25)", color: "#fff" },
  greenBtn: { border: 0, borderRadius: 18, padding: "12px 18px", background: "linear-gradient(135deg,#6BCB77,#45b85a)", color: "#fff", marginTop: 12, cursor: "pointer", fontWeight:800 },
  blueBtn: { border: 0, borderRadius: 18, padding: "12px 18px", background: "linear-gradient(135deg,#4D96FF,#3A7BDB)", color: "#fff", marginTop: 12, cursor: "pointer", fontWeight:800 },
  yellowBtn: { border: 0, borderRadius: 18, padding: "12px 18px", background: "linear-gradient(135deg,#FFD93D,#FFC233)", color: "#000", marginTop: 12, cursor: "pointer", fontWeight:800 },
  hint: { marginTop: 12, background: "#FFF9E6", border: "1px solid #FFE0A0", borderRadius: 12, padding: 10 },
  sentence: { fontSize: 26, marginTop: 12, lineHeight: 2 },
  blank: { display: "inline-block", minWidth: 62, textAlign: "center", borderBottom: "2px dashed #aaa", margin: "0 4px", verticalAlign: "middle", fontSize: 20, cursor: "pointer" },
  filledBlank: { background: "#E8F4FD", borderBottom: "none", borderRadius: 8, padding: "0 6px" },
  okBlank: { background: "#C8F7C5", boxShadow: "0 0 16px rgba(107,203,119,.5)", animation: "blankPop .4s" },
  badBlank: { background: "#FFB8B8", boxShadow: "0 0 16px rgba(255,107,107,.45)", animation: "blankWrong .4s" },
  feedback: { borderRadius: 12, padding: 10, marginTop: 12, animation: "bounceIn .5s" },
  bank: { marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { border: 0, borderRadius: 14, background: TOKENS.blue, color: "#fff", padding: "8px 10px", boxShadow: "0 4px 10px rgba(77,150,255,.4)", cursor: "pointer" },
  usedChip: { opacity: .4, background: "#999", cursor: "not-allowed", boxShadow: "none" },
};

const keyframes = `
@keyframes blankPop {0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
@keyframes blankWrong {0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes bounceIn {0%{transform:scale(0);opacity:0}60%{transform:scale(1.2)}80%{transform:scale(.95)}100%{transform:scale(1);opacity:1}}
@keyframes starSpin {0%{transform:scale(0) rotate(-180deg)}60%{transform:scale(1.3) rotate(20deg)}100%{transform:scale(1) rotate(0)}}
@keyframes shakeX {0%,100%{transform:translateX(0)}20%{transform:translateX(-12px)}40%{transform:translateX(12px)}60%{transform:translateX(-12px)}80%{transform:translateX(12px)}}
@keyframes cf0 {to{transform:translateY(110vh) rotate(360deg);opacity:.1}}
@keyframes cf1 {to{transform:translate(-60px,110vh) rotate(-420deg);opacity:.1}}
@keyframes cf2 {to{transform:translate(60px,110vh) rotate(420deg);opacity:.1}}
@keyframes floatUp {0%{transform:translateY(0) scale(.7);opacity:0}20%{opacity:1}100%{transform:translateY(-80vh) scale(1.2);opacity:0}}
`;

ReactDOM.createRoot(document.getElementById("root")).render(<ChineseLessons />);
