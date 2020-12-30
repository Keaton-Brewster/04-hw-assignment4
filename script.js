// divs and stuff
var timerDiv = document.querySelector("#timer"),
    timerSpan = document.querySelector("#timer-span"),
    startPage = document.querySelector("#start-page"),
    firstQ_Page = document.querySelector("#first-Q"),
    secondQ_Page = document.querySelector("#second-Q"),
    thirdQ_Page = document.querySelector("#third-Q"),
    fourthQ_Page = document.querySelector("#fourth-Q"),
    fifthQ_Page = document.querySelector("#fifth-Q"),
    finalScore = document.querySelector("#final-score"),
    finalScoreSpan = document.querySelector("#final-score-span"),
    highscoresDiv = document.querySelector("#high-scores"),
    highscoresList = document.querySelector("#list-of-scores"),
    afterSaveScreen = document.querySelector("#after-save"),
    correctNotif = document.querySelector("#correct-notif"),
    wrongNotif = document.querySelector("#wrong-notif"),

    // buttons and inputs
    startQuizBtn = document.querySelector("#start-quiz-btn"),
    viewHighScoreBtn = document.querySelector("#view-high-scores"),
    saveScoreBtn = document.querySelector("#save-score-btn"),
    userChosenName = document.querySelector("#user-chosen-name"),
    goBackBtn = document.querySelectorAll("#go-back"),

    score = 0,
    timeLeft = 60,

    savedHighScoresArr = [];

// initializing function
init();

function startQuiz() {
    clearInterval(timer);
    score = 0;
    timeLeft = 60;
    timerSpan.innerHTML = timeLeft;

    show(timerDiv);
    show(firstQ_Page);
    hide(startPage);
    hide(viewHighScoreBtn);

    timer = setInterval(() => {
        timeLeft--;
        timerSpan.innerHTML = timeLeft;
    }, 1000);
};

function viewHighScores() {
    show(highscoresDiv);
    hide(startPage);
    hide(finalScore);
}
// This is the function that gets run when you choose an answer in the quiz.
function checkAnswer(page, nextPage) {
    // I couldn't figure out how to add an event through external arguments
    // so i worked around this by adding an event handler within the function
    // so that the event remains intact
    page.addEventListener("click", function (event) {
        current = event.target.parentElement.getAttribute("id");
        console.log(current);
        // Then I check to make sure the user chose one of the available answers

        if (event.target.matches("button")) {
            // check the ID of the answer they chose, which I have already set to either 'correct' or 'wrong'
            answer = event.target.getAttribute("id");
            console.log(answer);

            if (answer === "correct") {
                score += 7;
                console.log(score);
                hide(page);
                show(correctNotif);
                setTimeout(() => {
                    hide(correctNotif)
                    show(nextPage);
                }, 1000);
            }
            else if (answer === "wrong") {
                timeLeft -= 7
                hide(page);
                show(wrongNotif);
                setTimeout(() => {
                    hide(wrongNotif);
                    show(nextPage);
                }, 1000);
            };
            // check to see if the last question has been answered, and if so end the test and give results
            if (current === "fifth-Q") {
                clearInterval(timer);
                hide(timerDiv);
                show(viewHighScoreBtn);
                finalScoreSpan.innerHTML = score + timeLeft // + timeLeft gives the user a bonus the faster they can complete the quiz!;
                return;
            };
        };
    });
};

function saveScore(event) {
    event.preventDefault();
    if (!userChosenName.value) {

    } else {
        var thisName = userChosenName.value.trim('');
        thisScore = score + timeLeft;

        var thisToSave = {
            name: thisName,
            score: thisScore
        };

        savedHighScoresArr.push(thisToSave);
        storeScores();
        hide(finalScore);
        show(afterSaveScreen);
    }
};


function storeScores() {
    localStorage.setItem("saved-scores", JSON.stringify(savedHighScoresArr));
    userChosenName.innerHTML = '';
};

function goBack(event) {
    event.preventDefault();
    var click = event.target;

    if (click.matches("#go-back")) {
        hide(afterSaveScreen);
        hide(highscoresDiv);
        show(startPage);
    };
};

function renderScores() {
    for (let i = 0; i < savedHighScoresArr; i++) {
        var scoreToList = document.createElement("li");
        scoreToList.textContent = savedHighScoresArr[i];

        highscoresList.appendChild(scoreToList);
    }
}

function init() {
    localScores = JSON.parse(localStorage.getItem("saved-scores"));

    if (!localScores) {
        return;
    } else {
        savedHighScoresArr = localScores;
    };
    console.log(savedHighScoresArr);
    renderScores();
};

function hide(ele) {
    ele.classList.add("hide");
}
function show(ele) {
    ele.classList.remove("hide");
}


startQuizBtn.addEventListener("click", startQuiz); // start quiz button

// handlers for the answers in the quiz
firstQ_Page.addEventListener("click", checkAnswer(firstQ_Page, secondQ_Page));
secondQ_Page.addEventListener("click", checkAnswer(secondQ_Page, thirdQ_Page));
thirdQ_Page.addEventListener("click", checkAnswer(thirdQ_Page, fourthQ_Page));
fourthQ_Page.addEventListener("click", checkAnswer(fourthQ_Page, fifthQ_Page));
fifthQ_Page.addEventListener("click", checkAnswer(fifthQ_Page, finalScore))

// handler for save score button
saveScoreBtn.addEventListener("click", saveScore);

// handler for 'go back' button
document.addEventListener("click", goBack);

// handler for view high scores
viewHighScoreBtn.addEventListener("click", viewHighScores);


