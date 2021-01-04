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
    eachQele = document.querySelectorAll(".question"),
    allNotifs =  document.querySelectorAll("#notif"),
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

savedScoresArr = [];


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

    show(timerDiv);
    show(firstQ_Page);
    hide(startPage);
    hide(viewHighScoreBtn);
    hide(allNotifs);

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
    // register the click on the button as an event by adding this listener, so that we can use the event for variables.
    page.addEventListener("click", function (event) {
        currentQuestion = event.target.parentElement.parentElement.parentElement.getAttribute("id");
        // Then I check to make sure the user chose one of the available answers

        if (event.target.matches("button")) {
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
            // check to see if the last question has been answered, and if so end the test and give results
            if (currentQuestion === "tenth-Q") {
                setTimeout(() => {
                    endQuiz();
                }, 1000);
            };
        };

        // local function to handle where to go, based on how much time is left in the quiz. 
        // if there is only 2 seconds left, it is determined not enough time to answer another question
        // and so the quiz will end.
        function process() {
            if (timeLeft < 2) {
                show(notification);
                disable(allButtons);
                setTimeout(() => {
                    endQuiz();
                }, 250);
            } else {
                show(notification);
                disable(allButtons);
                setTimeout(() => {
                    hide(page);
                    hide(notification);
                    show(nextPage);
                    enable(allButtons);
                }, 1000);
            };
        }
    });
};


// function to end the quiz, either when you finish answering all the questions, or if the time runs out
function endQuiz() {
    clearInterval(timer);
    hide(timerDiv);
    hide(eachQele);
    hide(allNotifs);
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
        hide(eachQele)
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
        var thisTime;
        if (score < 1) {
            thisScore = 0;
        } else {
            thisScore = score + timeLeft;
        };
        if (timeElapsed < 10) {
            thisTime = "0" + timeElapsed
        } else {
            thisTime = timeElapsed;
        };
        var thisToSave = {
            name: thisName,
            score: thisScore,
            time: thisTime
        };
        savedScoresArr.push(thisToSave);
        storeScores();
        // clear the list of any previously rendered scores, and THEN
        highscoresList.innerHTML = '';
        // Re render the list of scores stored in the local storage. 
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
    // display nothing in the highscores list, if there are no scores to display! (duh)
    if (savedScoresArr.length < 1) {
        highscoresList.innerHTML = ''
    } else {
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

            var nameforlist = document.createElement("td"),
                name = savedScoresArr[i].name;
            // wrote a little bit here that will capitalize the first letter of your name, in case you forgot to when typing it in. 
            nameforlist.innerHTML = name.charAt(0).toUpperCase() + name.slice(1);

            var scoreforlist = document.createElement("td");
            scoreforlist.innerHTML = savedScoresArr[i].score;

            var timeforlist = document.createElement("td");
            timeforlist.innerHTML = "0:" + savedScoresArr[i].time

            tr.appendChild(th);
            tr.appendChild(nameforlist);
            tr.appendChild(scoreforlist);
            tr.appendChild(timeforlist);
            highscoresList.appendChild(tr);
        };
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
    // check if argument contains more than one element, to determine the method for hiding
    if (x.length > 1) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.add("hide");
        };
    } else {
        x.classList.add("hide");
    };
};
function show(x) {
    if (x.length > 1) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("hide");
        };
    } else {
        x.classList.remove("hide");
    }
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

// handler for 'go back' button, applied to the whole document, since the button will appear in many different places at different times. 
document.addEventListener("click", goBack);

// handler for view high scores
viewHighScoreBtn.addEventListener("click", viewHighScores);

// handler for clearing the high scores
clearHighScoresBtn.addEventListener("click", clearHighScores);


