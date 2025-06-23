let countSpan = document.querySelector(".count span");
let bulletsEle = document.querySelector(".bullets");
let bullets = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countDownEle = document.querySelector(".count-down");
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.open("Get", "HTMLQuestions.json", true);
  myRequest.send();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let qCount = questionObject.length;
      createBullets(qCount);
      addQuestionsData(questionObject[currentIndex], qCount);
      countDown(5,qCount);
      submitButton.addEventListener("click", () => {
        let theRightAnswer = questionObject[currentIndex].right_answer;

        currentIndex++;

        checkAnswer(theRightAnswer, qCount);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        addQuestionsData(questionObject[currentIndex], qCount);
        handleBullets();

        showResults(qCount);

        clearInterval(countDownInterval);
        countDown(5,qCount);
      });
    }
  };
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 1; i <= num; i++) {
    let theBullet = document.createElement("span");
    if (i === 1) {
      theBullet.classList.add("on");
    }
    bullets.appendChild(theBullet);
  }
}
function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj.title);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);
    for (let i = 1; i <= 4; i++) {
      let divAnswer = document.createElement("div");
      divAnswer.classList.add("answer");

      let resultInput = document.createElement("input");
      resultInput.type = "radio";
      resultInput.name = "question";
      resultInput.id = `result_${i}`;
      resultInput.dataset.answer = obj[`result_${i}`];
      if (i === 1) {
        resultInput.checked = true;
      }

      let resultLabel = document.createElement("label");
      resultLabel.htmlFor = `result_${i}`;
      let resultText = document.createTextNode(obj[`result_${i}`]);
      resultLabel.appendChild(resultText);

      divAnswer.appendChild(resultInput);
      divAnswer.appendChild(resultLabel);

      answersArea.appendChild(divAnswer);
    }
  }
}

function checkAnswer(rAnswer, qNumber) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  console.log("ranswer:" + rAnswer);
  console.log("choosenanswer:" + choosenAnswer);
  if (rAnswer === choosenAnswer) {
    rightAnswers++;
    console.log("good");
  }
}
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  bulletsSpans = Array.from(bulletsSpans);
  bulletsSpans.forEach((span, index) => {
    if (index === currentIndex) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults ;
  if(currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bulletsEle.remove();
    if(rightAnswers >= (count / 2) && rightAnswers < count) {
      theResults = `<span class="good">Good</span> You answered ${rightAnswers} from ${count}`;
    }else if(rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span> You answered ${rightAnswers} from ${count} Excellent`;
    }else {
      theResults = `<span class="bad">Bad</span> You answered ${rightAnswers} from ${count}`;
    }
    results.innerHTML = theResults;
  }
}

function countDown(duration,count) {
  if(currentIndex < count) {
    let minutes;
    let seconds;
    countDownInterval = setInterval(()=> {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = (minutes < 10) ? `0${minutes} `: `${minutes}`;
      seconds = (seconds < 10) ? `0${seconds} `: `${seconds}`;
      countDownEle.innerHTML = `${minutes}:${seconds}`;
      if(--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    },1000)
  }
}