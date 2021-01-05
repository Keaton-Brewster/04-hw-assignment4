// divs and stuff
var timerDiv = document.querySelector("#timer"),
    timerSpan = document.querySelector("#timer-span"),
    startPage = document.querySelector("#start-page"),
    eachQele = document.querySelectorAll(".question"),
    allNotifs = document.querySelectorAll("#notif"),
    finalScore = document.querySelector("#final-score"),
    finalScoreSpan = document.querySelector("#final-score-span"),
    highscoresDiv = document.querySelector("#high-scores"),
    highscoresList = document.querySelector("#list-of-scores"),
    // buttons and inputs
    allButtons = document.querySelectorAll("button"),
    viewHighScoreBtn = document.querySelector("#view-high-scores"),
    userChosenName = document.querySelector("#user-chosen-name"),
    goBackBtn = document.querySelectorAll("#go-back"),
    
    score = 0,
    timeLeft = 60,
    timeElapsed = 0,
    currQ,
    nextQ,
    savedScoresArr = [];
    
init();

// function that runs when you click "start quiz"
function startQuiz() {
    // enable all buttons, in case any were left disabled after the last quiz
    enable(allButtons);
    // clear the timer interval so that when you start a new quiz, you start with a fresh timer, then set the timer
    clearInterval(timer);
    timeLeft = 60;
    timeElapsed = 0;
    currQ = 1;
    nextQ = currQ + 1;
    // make sure the score starts at 0 so you don't get your last results added to your next quiz. 
    score = 0;
    // timer starts at 60 'seconds'
    timerSpan.innerHTML = timeLeft;
    // clear the text input from the last time you may have saved a score
    userChosenName.value = '';

    show(timerDiv);
    show(document.querySelector("#Q-1"));
    hide(startPage);
    hide(viewHighScoreBtn);
    hideAll(allNotifs);

    // timer interval. 
    timer = setInterval(() => {
        timeLeft--;
        timeElapsed++;
        timerSpan.innerHTML = timeLeft;
        if (timeLeft < 1) {
            // end the quiz if you run out of time. 
            endQuiz();
        }
    }, 1000);
};

// This is the function that gets run when you choose an answer in the quiz.
function checkAnswer(event) {
    event.preventDefault();
    if (event.target.getAttribute("name") === "answer") {
        currentQuestion = event.target.parentElement.parentElement.parentElement.getAttribute("id");
        // check the ID of the answer they chose, which I have already set to either 'correct' or 'wrong'
        answer = event.target.getAttribute("id");
        // assign the correct/wrong notification to a variable so we can easily show and hide it
        notification = event.target.nextElementSibling;

        if (answer === "correct") {
            score += 10;
            process();
        }
        else if (answer === "wrong") {
            timeLeft -= 10;
            process();
        };
    };

    // local function to handle where to go, based on how much time is left in the quiz. 
    // if there is only 2 seconds left, it is determined not enough time to answer another question
    // and so the quiz will end.
    function process() {
        if (timeLeft < 2) {
            show(notification);
            disable(allButtons);
            endQuiz();
        } else {
            show(notification);
            disable(allButtons);
            setTimeout(() => {
                document.querySelector("#Q-" + currQ).classList.add("hide");
                hide(notification);
                if (currentQuestion === "Q-10") {
                    endQuiz();
                } else {
                    document.querySelector("#Q-" + nextQ).classList.remove("hide");
                    enable(allButtons);
                    currQ++;
                    nextQ++;
                }
            }, 600);
        };
    }
};

// function to end the quiz, either when you finish answering all the questions, or if the time runs out
function endQuiz() {
    clearInterval(timer);
    hide(timerDiv);
    hideAll(eachQele);
    hideAll(allNotifs);
    show(viewHighScoreBtn);
    show(finalScore);
    enable(allButtons);
    if (score < 1) {
        finalScoreSpan.innerHTML = 0;
    } else {
        finalScoreSpan.innerHTML = score + timeLeft; // + timeLeft gives the user a bonus the faster they can complete the quiz!;
    }
};

// this function here shows the high scores screen. 
// does so by the use of add and removing classes that CSS is influencing, with the use of "display: none;"
function viewHighScores() {
    show(highscoresDiv);
    hide(viewHighScoreBtn);
    hide(startPage);
    hide(finalScore);
};


function goBack(event) {
    event.preventDefault();
    var click = event.target;

    if (click.matches("#go-back")) {
        clearInterval(timer);
        hideAll(eachQele)
        hide(timerDiv);
        hide(finalScore);
        hide(highscoresDiv);
        show(startPage);
        show(viewHighScoreBtn);
    };
};

function saveScore(event) {
    event.preventDefault();
    if (!userChosenName.value) {
        return;
    } else {
        var thisName = userChosenName.value.trim('');
        var thisScore;
        // ensure score is not a negative number
        if (score < 1) {
            thisScore = 0;
        } else {
            thisScore = score + timeLeft;
        };
        var thisTime;
        // ensure the display formatting for the time is correct/standard
        if (timeElapsed < 10) {
            thisTime = "0" + timeElapsed
        } else {
            thisTime = timeElapsed;
        };
        var statsToSave = {
            name: thisName,
            score: thisScore,
            time: thisTime
        };
        savedScoresArr.push(statsToSave);
        storeScores();
        renderScores();
        viewHighScores();
    };
};

// here is the little function that stores the scores objects to the local storage with the use of JSON
function storeScores() {
    localStorage.setItem("saved-scores", JSON.stringify(savedScoresArr));
};

// this function clears the array AND the localStorage, then renders the list again. 
function clearHighScores() {
    for (let i = 0; i < savedScoresArr.length;) {
        savedScoresArr.pop();
    }
    storeScores();
    renderScores();
};

function renderScores() {
    // clear the list of any previously rendered scores, as they will be rendered again as a result of this function
    highscoresList.innerHTML = ''

    // Found the .sort() function when looking for a way to list the scores based on actual score, 
    // and not just by time entered. 
    savedScoresArr.sort(function (a, b) {
        return b.score - a.score;
    });

    for (let i = 0; i < savedScoresArr.length; i++) {
        var tr = document.createElement("tr");

        var th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.innerHTML = (i + 1);

        var nameForList = document.createElement("td"),
            name = savedScoresArr[i].name;
        // wrote a little bit here that will capitalize the first letter of your name, in case you forgot to when typing it in. 
        nameForList.innerHTML = name.toUpperCase();

        var scoreForList = document.createElement("td");
        scoreForList.innerHTML = savedScoresArr[i].score;

        var timeForList = document.createElement("td");
        timeForList.innerHTML = "0:" + savedScoresArr[i].time

        tr.appendChild(th);
        tr.appendChild(nameForList);
        tr.appendChild(scoreForList);
        tr.appendChild(timeForList);
        highscoresList.appendChild(tr);
    };
};

function init() {
    localScores = JSON.parse(localStorage.getItem("saved-scores"));

    if (!localScores) {
        return;
    } else {
        savedScoresArr = localScores;
    };
    renderScores();
};

// main functions for showing and hiding divs and buttons and such, so that
// it appears as though you are going through different webpages, but it is all still done inside one webpage. 
function hide(x) {
    x.classList.add("hide");
};
function show(x) {
    x.classList.remove("hide");
};
function hideAll(x) {
    for (let i = 0; i < x.length; i++) {
        x[i].classList.add("hide");
    };
};
function showAll(x) {
    for (let i = 0; i < x.length; i++) {
        x[i].classList.remove("hide");
    };
};

// functions to enable and disable buttons for the answerCheck()
// so that when you chose an answer, you cant also click a bunch of other answers before the next question comes up. 
function enable(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i].disabled = false;
    };
};
function disable(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i].disabled = true
    };
};

// button handlers
document.querySelector("#start-quiz-btn").addEventListener("click", startQuiz);
document.querySelector("#all-questions").addEventListener("click", checkAnswer);
document.querySelector("#save-score-btn").addEventListener("click", saveScore);
document.addEventListener("click", goBack);
viewHighScoreBtn.addEventListener("click", viewHighScores);
document.querySelector("#clear-high-scores").addEventListener("click", clearHighScores);


