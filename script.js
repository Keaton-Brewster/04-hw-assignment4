var viewHighScoreBtn = document.querySelector("#view-high-scores"),
    timerDiv = document.querySelector("#timer"),
    timerSpan = document.querySelector("#timer-span"),
    startPage = document.querySelector("#start-page"),
    startQuizBtn = document.querySelector("#start-quiz-btn"),
    firstQ_Page = document.querySelector("#first-Q"),
    secondQ_Page = document.querySelector("#second-Q"),
    thirdQ_Page = document.querySelector("#third-Q"),
    fourthQ_Page = document.querySelector("#fourth-Q"),
    fifthQ_Page = document.querySelector("#fifth-Q"),
    finalScore = document.querySelector("#final-score"),
    finalScoreSpan = document.querySelector("#final-score-span"),
    userChosenName = document.querySelector("#user-chosen-name"),
    saveScoreBtn = document.querySelector("#save-score-btn"),
    highscores = document.querySelector("#high-scores"),
    afterSaveScreen = document.querySelector("#after-save"),
    goBackBtn = document.querySelector("#go-back"),
    correctNotif = document.querySelector("#correct-notif"),
    wrongNotif = document.querySelector("#wrong-notif"),

    score = 0,
    timeLeft = 60,

    savedHighScoresArr = [];


function startQuiz() {
    clearInterval(timer);
    score = 0;
    timeLeft = 60;
    timerSpan.innerHTML = timeLeft;

    timerDiv.classList.remove("hide");
    startPage.classList.add("hide");
    firstQ_Page.classList.remove("hide");

    timer = setInterval(() => {
        timeLeft--;
        timerSpan.innerHTML = timeLeft;
    }, 1000);
};

init();

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
                page.classList.add("hide");
                correctNotif.classList.remove("hide");
                setTimeout(() => {
                    correctNotif.classList.add("hide");
                    nextPage.classList.remove("hide");
                }, 1000);
            }

            else if (answer === "wrong") {
                timeLeft -= 7
                page.classList.add("hide");
                wrongNotif.classList.remove("hide");
                setTimeout(() => {
                    wrongNotif.classList.add("hide");
                    nextPage.classList.remove("hide");
                }, 1000);
            };
            // check to see if the last question has been answered, and if so end the test and give results
            if (current === "fifth-Q") {
                clearInterval(timer);
                timerDiv.classList.add("hide");
                getResults();
                return;
            };
        };
    });
};

function getResults() {
    finalScoreSpan.innerHTML = score + timeLeft // + timeLeft gives the user a bonus the faster they can complete the quiz!;
};

function saveScore(event) {
    event.preventDefault();
    if (!userChosenName.value) {

    } else {
        var thisName = userChosenName.value.trim('');
        thisScore = score;

        var thisToSave = {
            name: thisName,
            score: thisScore
        };

        savedHighScoresArr.push(thisToSave);
        storeScores();
        finalScore.classList.add("hide");
        afterSaveScreen.classList.remove("hide");
    }
};

function storeScores() {
    localStorage.setItem("saved-scores", JSON.stringify(savedHighScoresArr));
    userChosenName.innerHTML = '';
};

function goBack() {
    document.childNodes.classList.add("hide");
    startPage.classList.remove("hide");
}

function renderScores() {

}

function init() {
    localScores = JSON.parse(localStorage.getItem("saved-scores"));

    if (!localScores) {
        return;
    } else {
        savedHighScoresArr = localScores;
    };
    renderScores();
};

// viewHighScoreBtn.addEventListener("click", function);
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
goBackBtn.addEventListener("click", goBack);


