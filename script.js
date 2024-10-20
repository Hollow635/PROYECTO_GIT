const startBtn = document.querySelector("#start"), 
  screens = document.querySelectorAll(".screen"),
  timeList = document.querySelector("#time-list"),
  difficultyList = document.querySelector("#difficulty-list"),
  timeEl = document.querySelector("#time");  // Corrige el nombre de la variable

let time = 0,
    unlimited = false,
    difficulty = 0,
    playing = false,
    hits = 0;
    missed = 0;
    interval;

startBtn.addEventListener("click", () => {
    screens[0].classList.add("up");
});

timeList.addEventListener("click", (e) => {
    if(e.target.classList.contains("time-btn")) {
        time = parseInt(e.target.getAttribute("data-time"));
        unlimited = e.target.getAttribute("data-unlimited");
        screens[1].classList.add("up");
    }
});

difficultyList.addEventListener("click", (e) =>  {
    if(e.target.classList.contains("difficulty-btn")){
        difficulty = parseInt(e.target.getAttribute("data-difficulty"));
        screens[2].classList.add("up");
        startGame();
    }
});

function startGame() {
    playing = true;
    interval = setInterval(decreaseTime, 1000);
    createRandomCircle();
}

function decreaseTime() {
    if (unlimited) {

        setTime("∞");
        return;
    }
    if (time === 0) {

        clearInterval(interval); 
        return;
    }
    let current = --time;
    let milliseconds = time * 1000;

    let minutes = Math.floor(milliseconds / (1000 * 60));
    let seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    setTime(`${minutes}:${seconds}`); 
}

function setTime(time) {
    timeEl.innerHTML = time; 
}


function createRandomCircle() {

}