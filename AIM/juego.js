const startBtn = document.querySelector("#start"), 
    screens = document.querySelectorAll(".screen"),
    timeList = document.querySelector("#time-list"),
    difficultyList = document.querySelector("#difficulty-list"),
    timeEl = document.querySelector("#time"),
    board = document.querySelector("#board"),
    hitsEl = document.querySelector("#hits"),
    accuracyEl = document.querySelector("#accuracy"),
    hitsOver = document.querySelector("#hits-over"),
    accuracyOver = document.querySelector("#accuracy-over"),
    hearts = document.querySelectorAll(".heart"),
    restartBtns = document.querySelectorAll(".restart"),
    fullScreenBtn = document.querySelector("#fullscreen"),
    minimizeBtn = document.querySelector("#minimize");

let time = 0,
    unlimited = false,
    difficulty = 0,
    playing = false,
    hits = 0,
    missed = 0,
    accuracy = 0,
    interval;

startBtn.addEventListener("click", () => {
    screens[0].classList.add("up");
});

timeList.addEventListener("click", (e) => {
    if (e.target.classList.contains("time-btn")) {
        time = parseInt(e.target.getAttribute("data-time"));
        unlimited = e.target.getAttribute("data-unlimited");
        screens[1].classList.add("up");
    }
});

difficultyList.addEventListener("click", (e) => {
    if (e.target.classList.contains("difficulty-btn")) {
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
        finishGame();
    } else {
        time--;
        setTime(formatTime(time));
        createRandomCircle(); 
    }
}

function setTime(time) {
    timeEl.innerHTML = time; 
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${secs < 10 ? "0" + secs : secs}`;
}

function createRandomCircle() {
    if (!playing) return;

    const circle = document.createElement("div");
    const size = getRandomNumber(30, 100);
    const colors = ["#03DAC6", "#FF0266", "#b3ff00", "#ccff00", "#9D00FF"];
    const { width, height } = board.getBoundingClientRect();
    const x = getRandomNumber(0, width - size);
    const y = getRandomNumber(0, height - size);
    circle.classList.add("circle");
    circle.style.width = `${size}px`; 
    circle.style.height = `${size}px`; 
    circle.style.top = `${y}px`; 
    circle.style.left = `${x}px`; 
    circle.style.background = `${colors[Math.floor(Math.random() * colors.length)]}`;
    board.append(circle);

    circle.style.animationDuration = `${getAnimationDuration(difficulty)}s`; // Usar la nueva función

    circle.addEventListener("animationend", () => {
        circle.remove();
        addMissed(); 
    });
} 

function getAnimationDuration(difficulty) {
    switch (difficulty) {
        case 1: // Dificultad fácil
            return 3; // 3 segundos
        case 2: // Dificultad media
            return 2; // 2 segundos
        case 3: // Dificultad difícil
            return 1; // 1 segundo
        default:
            return 4; // Valor por defecto en caso de que no se establezca una dificultad
    }
}

board.addEventListener("click", (e) => {
    if (e.target.classList.contains("circle")) {
        hits++;
        e.target.remove();
        hitsEl.innerHTML = hits;
    } else {
        addMissed(); 
    }
    calculateAccuracy();
});

function finishGame() {
    playing = false;
    clearInterval(interval);
    board.innerHTML = "";
    screens[3].classList.add("up");
    hitsEl.innerHTML = 0;
    timeEl.innerHTML = "00:00";
    accuracyEl.innerHTML = "0%";

    hitsOver.innerHTML = hits;
    accuracyOver.innerHTML = `${accuracy}%`;
}

function addMissed() {
    missed++;
    for (let heart of hearts) {
        if (!heart.classList.contains("dead")) {
            heart.classList.add("dead");
            break;
        }
    }

    if (Array.from(hearts).every(heart => heart.classList.contains("dead"))) {
        finishGame();
    }
}

function calculateAccuracy() {
    accuracy = hits + missed > 0 ? (hits / (hits + missed)) * 100 : 0;
    accuracy = accuracy.toFixed(2);
    accuracyEl.innerHTML = `${accuracy}%`;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min); 
}

restartBtns.forEach((btn) => {
    btn.addEventListener("click", restartGame);
});

function restartGame() {
    finishGame();
    screens.forEach(screen => screen.classList.remove("up"));
    time = 0;
    difficulty = 0;
    hits = 0;    
    missed = 0;
    accuracy = 0;
    playing = false;
    unlimited = false;
    hearts.forEach((heart) => {
        heart.classList.remove("dead");
    });
}

fullScreenBtn.addEventListener("click", fullScreen);

let elem = document.documentElement;

function fullScreen() {
    if(elem.requestFullscreen){
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen){
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullsScreen) {
        elem.webkitRequestFullsScreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }

    fullScreenBtn.style.display = "none"
    fullScreenBtn.style.display = "block"
}

minimizeBtn.addEventListener("click", minimize);

function minimize() {
    if(document.exitfullscreen) {
        document.exitfullscreen();
    } else if (document.mozCancelFullsScreen) {
        document.mozCancelFullsScreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if(document.msRequestFullscreen) {
        document.msRequestFullscreen();
    }
    minimizeBtn.style.display = "none"
    minimizeBtn.style.display = "block"
}
