let score = 0;
let timeLeft = 0;
let timer;
let currentAnswer = "";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function startGame() {
  score = 0;
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("settings")?.classList?.add("hidden");

  document.getElementById("game").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");

  timeLeft = document.getElementById("timeInput").value * 60;
  startTimer();
  nextQuestion();
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      endGame();
    }
    timeLeft--;
    document.getElementById("timer").innerText =
      "Time: " + Math.floor(timeLeft / 60) + ":" + (timeLeft % 60).toString().padStart(2, "0");
  }, 1000);
}

function nextQuestion() {
  document.getElementById("feedback").innerText = "";
  document.getElementById("answer").value = "";

  let mode = document.getElementById("examMode").value;

  if (mode === "button") {
    generateButtonQuestion();
    document.getElementById("answer").classList.add("hidden");
  } else {
    generateTypingQuestion();
    document.getElementById("buttons").classList.add("hidden");
    document.getElementById("answer").classList.remove("hidden");
  }
}

function generateTypingQuestion() {
  let i = Math.floor(Math.random() * 26);
  currentAnswer = i + 1;
  document.getElementById("question").innerText =
    "Alphabet → Number : " + alphabet[i];
}

function generateButtonQuestion() {
  document.getElementById("buttons").classList.remove("hidden");

  let n = Math.floor(Math.random() * 26) + 1;
  currentAnswer = alphabet[n - 1];
  document.getElementById("question").innerText = n + "th letter";

  let btnDiv = document.getElementById("buttons");
  btnDiv.innerHTML = "";

  let shuffled = [...alphabet].sort(() => Math.random() - 0.5);

  shuffled.forEach(letter => {
    let btn = document.createElement("button");
    btn.innerText = letter;
    btn.onclick = () => checkButtonAnswer(btn, letter);
    btnDiv.appendChild(btn);
  });
}

document.getElementById("answer").addEventListener("keydown", function (e) {
  if (e.key === "Enter") checkTypingAnswer();
});

function checkTypingAnswer() {
  let ans = document.getElementById("answer").value.trim();
  if (ans == currentAnswer) {
    score++;
    document.getElementById("correctSound").play();
    document.getElementById("feedback").innerText = "Correct";
  } else {
    document.getElementById("wrongSound").play();
    document.getElementById("feedback").innerText = "Wrong";
  }
  document.getElementById("score").innerText = "Score: " + score;
  setTimeout(nextQuestion, 500);
}

function checkButtonAnswer(btn, letter) {
  if (letter === currentAnswer) {
    btn.classList.add("correct");
    score++;
    document.getElementById("correctSound").play();
  } else {
    btn.classList.add("wrong");
    document.getElementById("wrongSound").play();
  }
  document.getElementById("score").innerText = "Score: " + score;
  setTimeout(nextQuestion, 600);
}

function endGame() {
  clearInterval(timer);
  document.getElementById("game").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("final").innerText = "Final Score: " + score;
  document.getElementById("timeSound").play();
}
