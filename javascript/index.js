let countSpan = document.querySelector(".quiz-app .count > span");
let spanContainer = document.querySelector(".bullets .spans");
let questionsSection = document.querySelector(".questions-section");
let answersSection = document.querySelector(".answers-section");
let submitButton = document.querySelector(".submit");
let bullets = document.querySelector(".bullets");
let theResultsContainer = document.querySelector(".results");
let countdownDiv = document.querySelector(".countdown");
let answercheckedcontainer = document.querySelector(".answercheckedcontainer");
let currentIndex = 0;
let rightAnswer = 0;
let countDownInterval;
function getQuestions() {
  let ajaxRe = new XMLHttpRequest();
  ajaxRe.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;
      crweatebullets(questionsCount);
      addQData(questionsObject[currentIndex], questionsCount);
      countDown(120, questionsCount);
      submitButton.onclick = () => {
        let rightAnswer = questionsObject[currentIndex].right_answer;
        currentIndex++;
        chekAnswer(rightAnswer, questionsCount);
        questionsSection.innerHTML = "";
        answersSection.innerHTML = "";
        addQData(questionsObject[currentIndex], questionsCount);
        handleBullet();
        clearInterval(countDownInterval);
        countDown(120, questionsCount);
        shoeResult(questionsCount);
      };
    }
  };
  ajaxRe.open("GET", "/json/questions.json", true);
  ajaxRe.send();
}
getQuestions();
function crweatebullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let thebullet = document.createElement("span");
    if (i === 0) {
      thebullet.className = "on";
    }
    spanContainer.appendChild(thebullet);
  }
}
function addQData(obj, count) {
  if (currentIndex < count) {
    let qTitle = document.createElement("h3");
    let qText = document.createTextNode(obj.title);
    qTitle.appendChild(qText);
    questionsSection.appendChild(qTitle);
    for (let i = 1; i <= 4; i++) {
      let mianDiv = document.createElement("div");
      mianDiv.className = "answer";
      let inputRadio = document.createElement("input");
      inputRadio.name = "question";
      inputRadio.type = "radio";
      inputRadio.id = `answer_${i}`;
      inputRadio.dataset.answer = obj[`answer_${i}`];
      let thelabel = document.createElement("label");
      thelabel.htmlFor = `answer_${i}`;
      let thelabelText = document.createTextNode(obj[`answer_${i}`]);
      thelabel.appendChild(thelabelText);
      mianDiv.appendChild(inputRadio);
      mianDiv.appendChild(thelabel);
      answersSection.appendChild(mianDiv);
    }
  }
}

function chekAnswer(Ranswer, count) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;

      console.log(true);
      let answerCh = document.createElement("div");
      let AnswersStatus = document.createElement("span");

      if (choosenAnswer === Ranswer) {
        AnswersStatus.className = "true";
        AnswersStatus.textContent = "Correct";
        answerCh.textContent = Ranswer;
        answerCh.appendChild(AnswersStatus);
      } else {
        AnswersStatus.className = "fales";
        AnswersStatus.textContent = "Incorrect";

        answerCh.textContent = Ranswer;
        answerCh.appendChild(AnswersStatus);
      }
      answercheckedcontainer.appendChild(answerCh);
    }
  }
  if (Ranswer === choosenAnswer) {
    rightAnswer++;
  }
}

function handleBullet() {
  spanBullets = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpan = Array.from(spanBullets);
  arrayOfSpan.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function shoeResult(count) {
  let theResults;
  if (currentIndex === count) {
    questionsSection.remove();
    answersSection.remove();
    bullets.remove();
    submitButton.remove();
    answercheckedcontainer.style.display = "block";
    theResultsContainer.style.display = "block";

    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResults = `<span class="good"> Good </span> , ${rightAnswer} From ${count} `;
    } else if (rightAnswer === count) {
      theResults = `<span class="perfect"> Perfect </span> , All Answer is Right`;
    } else {
      theResults = `<span class="bad"> Bad </span> , ${rightAnswer} From ${count}`;
    }
    theResultsContainer.innerHTML = theResults;
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownDiv.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
