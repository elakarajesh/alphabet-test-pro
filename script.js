let score = 0;
let timeLeft;
let timer;
let correct = 0;
let wrong = 0;
let currentAnswer = "";

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function startGame(){
 score = 0; correct = 0; wrong = 0;
 document.getElementById("game").classList.remove("hidden");
 document.getElementById("result").classList.add("hidden");
 timeLeft = document.getElementById("examMode").value === "bank" ? 1200 :
            document.getElementById("timeInput").value * 60;
 startTimer();
 nextQuestion();
}

function startTimer(){
 timer = setInterval(()=>{
  if(timeLeft<=0) return endGame();
  timeLeft--;
  document.getElementById("timer").innerText = 
   `Time: ${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}`;
 },1000);
}

function nextQuestion(){
 document.getElementById("feedback").innerText="";
 document.getElementById("answer").value="";

 let types = ["ltr","rtl","odd","even","alphaNum","numAlpha"];
 let mode = document.getElementById("questionMode").value;
 let type = mode==="mixed" ? types[Math.floor(Math.random()*types.length)] : types[0];
 generate(type);
}

function generate(type){
 let i = Math.floor(Math.random()*26);
 let L = alpha[i];

 switch(type){
  case "ltr":
   currentAnswer = i+1;
   q(`Position of ${L} (L→R)?`); break;
  case "rtl":
   currentAnswer = 26-i;
   q(`Position of ${L} (R→L)?`); break;
  case "odd":
   currentAnswer = (i+1)%2?"YES":"NO";
   q(`Is ${L} Odd position?`); break;
  case "even":
   currentAnswer = (i+1)%2===0?"YES":"NO";
   q(`Is ${L} Even position?`); break;
  case "alphaNum":
   currentAnswer = i+1;
   q(`Alphabet → Number: ${L}`); break;
  case "numAlpha":
   let n = Math.floor(Math.random()*26)+1;
   currentAnswer = alpha[n-1];
   q(`Number → Alphabet: ${n}`); break;
 }
}

function q(text){ document.getElementById("question").innerText=text; }

document.getElementById("answer").addEventListener("keydown",e=>{
 if(e.key==="Enter") check();
});

function check(){
 let ans = document.getElementById("answer").value.trim().toUpperCase();
 let neg = parseFloat(document.getElementById("negative").value);

 if(ans==currentAnswer){
  score++; correct++;
  document.getElementById("correctSound").play();
  fb("✅ Correct");
 } else {
  score -= neg; wrong++;
  document.getElementById("wrongSound").play();
  fb(`❌ Wrong (${currentAnswer})`);
 }
 document.getElementById("score").innerText = `Score: ${score.toFixed(2)}`;
 setTimeout(nextQuestion,600);
}

function fb(msg){ document.getElementById("feedback").innerText=msg; }

function endGame(){
 clearInterval(timer);
 document.getElementById("timeSound").play();
 document.getElementById("game").classList.add("hidden");
 document.getElementById("result").classList.remove("hidden");

 let data = {
  score:score.toFixed(2),
  correct, wrong,
  date:new Date().toLocaleString()
 };

 saveScore(data);
 showResult(data);
}

function saveScore(data){
 let board = JSON.parse(localStorage.getItem("leaderboard"))||[];
 board.push(data);
 board.sort((a,b)=>b.score-a.score);
 localStorage.setItem("leaderboard",JSON.stringify(board.slice(0,5)));
}

function showResult(d){
 document.getElementById("final").innerHTML=
  `Score: ${d.score}<br>Correct: ${d.correct}<br>Wrong: ${d.wrong}`;

 let list = JSON.parse(localStorage.getItem("leaderboard"))||[];
 document.getElementById("leaderboard").innerHTML =
  list.map(x=>`<li>${x.score} - ${x.date}</li>`).join("");
}