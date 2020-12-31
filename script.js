// divs and stuff
var timerDiv = document.querySelector("#timer"),
    timerSpan = document.querySelector("#timer-span"),
    startPage = document.querySelector("#start-page"),
    firstQ_Page = document.querySelector("#first-Q"),
    secondQ_Page = document.querySelector("#second-Q"),
    thirdQ_Page = document.querySelector("#third-Q"),
    fourthQ_Page = document.querySelector("#fourth-Q"),
    fifthQ_Page = document.querySelector("#fifth-Q"),
    sixthQ_Page = document.querySelector("#sixth-Q"),
    seventhQ_Page = document.querySelector("#seventh-Q"),
    eighthQ_Page = document.querySelector("#eighth-Q"),
    ninthQ_Page = document.querySelector("#ninth-Q"),
    tenthQ_Page = document.querySelector("#tenth-Q"),
    allQuestionsDiv = document.querySelector("#all-questions"),
    finalScore = document.querySelector("#final-score"),
    finalScoreSpan = document.querySelector("#final-score-span"),
    highscoresDiv = document.querySelector("#high-scores"),
    highscoresList = document.querySelector("#list-of-scores"),

    // buttons and inputs
    allButtons = document.querySelectorAll("button"),
    startQuizBtn = document.querySelector("#start-quiz-btn"),
    viewHighScoreBtn = document.querySelector("#view-high-scores"),
    saveScoreBtn = document.querySelector("#save-score-btn"),
    userChosenName = document.querySelector("#user-chosen-name"),
    goBackBtn = document.querySelectorAll("#go-back"),
    clearHighScoresBtn = document.querySelector("#clear-high-scores"),

    score = 0,
    timeLeft = 60,
    timeElapsed = 0;

    savedHighScoresArr = [];

// initializing function
init();

// function that runs when you click "start quiz"
function startQuiz() {
    // enable all buttons, in case any were left disabled after the last quiz
    enable(allButtons);
    // clear the timer interval so that when you start a new quiz, you start with a fresh timer, then set the timer
    clearInterval(timer);
    timeLeft = 60;
    timeElapsed = 0;
    // make sure the score starts at 0 so you don't get your last results added to your next quiz. 
    score = 0;
    // timer starts at 60 'seconds'
    timerSpan.innerHTML = timeLeft;
    // clear the text input from the last time you may have saved a score
    userChosenName.innerHTML = '';

    show(allQuestionsDiv);
    show(timerDiv);
    show(firstQ_Page);
    hide(startPage);
    hide(viewHighScoreBtn);

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
function checkAnswer(page, nextPage) {
    // I couldn't figure out how to add an event through external arguments
    // so i worked around this by adding an event handler within the function
    // so that the event remains intact
    page.addEventListener("click", function (event) {
        current = event.target.parentElement.parentElement.parentElement.getAttribute("id");
        // Then I check to make sure the user chose one of the available answers

        if (event.target.matches("button")) {
            // check the ID of the answer they chose, which I have already set to either 'correct' or 'wrong'
            answer = event.target.getAttribute("id");
            click = event.target;

            if (answer === "correct") {
                score += 20;
                show(click.nextElementSibling);
                disable(allButtons);
                setTimeout(() => {
                    hide(page)
                    hide(click.nextElementSibling)
                    show(nextPage);
                    enable(allButtons);
                }, 1000);
            }
            else if (answer === "wrong") {
                timeLeft -= 10
                show(click.nextElementSibling);
                disable(allButtons);
                setTimeout(() => {
                    hide(page)
                    hide(click.nextElementSibling);
                    show(nextPage);
                    enable(allButtons);
                }, 1000);
            };
            // check to see if the last question has been answered, and if so end the test and give results
            if (current === "tenth-Q") {
                setTimeout(() => {
                    endQuiz();
                }, 1000);
            };
        };
    });
};

// function to end the quiz, either when you finish answering all the questions, or if the time runs out
function endQuiz() {
    clearInterval(timer);
    hide(timerDiv);
    hide(allQuestionsDiv);
    show(viewHighScoreBtn);
    show(finalScore);
    finalScoreSpan.innerHTML = score - timeElapsed; // + timeLeft gives the user a bonus the faster they can complete the quiz!;
    return;
};

// this function here shows the high scores screen. 
// does so by the use of add and removing classes that CSS is influencing, with the use of "display: none;"
function viewHighScores() {
    show(highscoresDiv);
    hide(viewHighScoreBtn);
    hide(startPage);
    hide(finalScore);
};

function saveScore(event) {
    event.preventDefault();
    if (!userChosenName.value) {
        return;
    } else {
        var thisName = userChosenName.value.trim('');
        thisScore = score - timeElapsed;
        var thisToSave = {
            name: thisName,
            score: thisScore
        };
        savedHighScoresArr.push(thisToSave);
        storeScores();
        // clear the list of any previously rendered scores, and THEN
        highscoresList.innerHTML = '';
        // Re render the list of scores stored in the local storage. 
        renderScores();
        hide(finalScore);
        show(highscoresDiv);
    };
};

function goBack(event) {
    event.preventDefault();
    var click = event.target;

    if (click.matches("#go-back")) {
        hide(finalScore);
        hide(highscoresDiv);
        show(startPage);
        show(viewHighScoreBtn);
    };
};

function clearHighScores() {
    for (let i = 0; i < savedHighScoresArr.length;) {
        savedHighScoresArr.pop();
    }
    storeScores();
    renderScores();
};

function renderScores() {
    if (savedHighScoresArr.length < 1) {
        highscoresList.innerHTML = ''
    } else {
        // not super sure how this sorting thing works, but I found it online, and it allows me to sort the list by score, instead of just most recently added, so thats cool
        // I will need to figure out exactly what it is doing at some point 
        var sorted = savedHighScoresArr.slice(0);
        sorted.sort(function(a,b) {
            return b.score - a.score;
        });
        
        for (let i = 0; i < sorted.length; i++) {
            var tr = document.createElement("tr");

            var th = document.createElement("th");
            th.setAttribute("scope", "row");
            th.innerHTML = (i + 1);

            var nameforlist = document.createElement("td"),
                name = sorted[i].name;
            // wrote a little tid-bit here that will capitalize the first letter of your name, in case you forgot to when typing it in. 
            nameforlist.innerHTML = name.charAt(0).toUpperCase() + name.slice(1);

            var scoreforlist = document.createElement("td");
            scoreforlist.innerHTML = sorted[i].score;

            tr.appendChild(th);
            tr.appendChild(nameforlist);
            tr.appendChild(scoreforlist);
            highscoresList.appendChild(tr);
        };
    };
};

function init() {
    localScores = JSON.parse(localStorage.getItem("saved-scores"));

    if (!localScores) {
        return;
    } else {
        savedHighScoresArr = localScores;
    };
    renderScores();
};

// here is the little function that stores the scores objects to the local storage with the use of JSON
function storeScores() {
    localStorage.setItem("saved-scores", JSON.stringify(savedHighScoresArr));
};

// main functions for showing and hiding divs and buttons and such, so that
// it appears as though you are going through different webpages, but it is all still done inside one webpage. 
function hide(ele) {
    ele.classList.add("hide");
};
function show(ele) {
    ele.classList.remove("hide");
};

// functions to enable and disable buttons for the answerCheck()
// so that when you chose an answer, you cant also click a bunch of other answers before the next question comes up. 
function enable(arr) {
    for (let i = 0; i < arr.length; i++) {
        allButtons[i].disabled = false;
    };
};
function disable(arr) {
    for (let i = 0; i < arr.length; i++) {
        allButtons[i].disabled = true
    };
};

startQuizBtn.addEventListener("click", startQuiz); // start quiz button

// handlers for the answers in the quiz
firstQ_Page.addEventListener("click", checkAnswer(firstQ_Page, secondQ_Page));
secondQ_Page.addEventListener("click", checkAnswer(secondQ_Page, thirdQ_Page));
thirdQ_Page.addEventListener("click", checkAnswer(thirdQ_Page, fourthQ_Page));
fourthQ_Page.addEventListener("click", checkAnswer(fourthQ_Page, fifthQ_Page));
fifthQ_Page.addEventListener("click", checkAnswer(fifthQ_Page, sixthQ_Page));
sixthQ_Page.addEventListener("click", checkAnswer(sixthQ_Page, seventhQ_Page));
seventhQ_Page.addEventListener("click", checkAnswer(seventhQ_Page, eighthQ_Page));
eighthQ_Page.addEventListener("click", checkAnswer(eighthQ_Page, ninthQ_Page));
ninthQ_Page.addEventListener("click", checkAnswer(ninthQ_Page, tenthQ_Page));
tenthQ_Page.addEventListener("click", checkAnswer(tenthQ_Page, finalScore));

// handler for save score button
saveScoreBtn.addEventListener("click", saveScore);

// handler for 'go back' button
document.addEventListener("click", goBack);

// handler for view high scores
viewHighScoreBtn.addEventListener("click", viewHighScores);

// handler for clearing the high scores
clearHighScoresBtn.addEventListener("click", clearHighScores);


